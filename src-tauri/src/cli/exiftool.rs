use crate::models::MetadataWriteOptions;

pub fn has_write_metadata(metadata: &MetadataWriteOptions) -> bool {
    [
        &metadata.title,
        &metadata.author,
        &metadata.creator,
        &metadata.description,
        &metadata.keywords,
        &metadata.copyright,
        &metadata.comment,
    ]
    .iter()
    .any(|value| value.as_ref().is_some_and(|text| !text.trim().is_empty()))
}

pub fn build_write_args(metadata: &MetadataWriteOptions, output_file: &str) -> Vec<String> {
    let mut args = Vec::new();

    args.push("-overwrite_original".to_string());
    args.push("-P".to_string());

    /*
      Do not write XMP-dc lang-alt fields for title/description/copyright.
      Some Linux image property viewers show them as:
        lang="x-default" value

      We clear previous XMP-dc lang-alt fields and write cleaner EXIF / Windows XP / IPTC fields.
    */
    clear_xmp_lang_alt_fields(&mut args);

    if let Some(value) = clean(&metadata.title) {
        args.push(format!("-EXIF:XPTitle={value}"));
        args.push(format!("-IPTC:ObjectName={value}"));
    }

    if let Some(value) = clean(&metadata.description) {
        args.push(format!("-EXIF:ImageDescription={value}"));
        args.push(format!("-EXIF:XPSubject={value}"));
        args.push(format!("-IPTC:Caption-Abstract={value}"));
    }

    if let Some(value) = clean(&metadata.author) {
        args.push(format!("-EXIF:Artist={value}"));
        args.push(format!("-EXIF:XPAuthor={value}"));
        args.push(format!("-IPTC:By-line={value}"));
    }

    if let Some(value) = clean(&metadata.creator) {
        args.push(format!("-EXIF:Software={value}"));
        args.push(format!("-XMP-xmp:CreatorTool={value}"));
    }

    if let Some(value) = clean(&metadata.keywords) {
        args.push(format!("-EXIF:XPKeywords={value}"));

        for keyword in split_keywords(&value) {
            args.push(format!("-IPTC:Keywords+={keyword}"));
        }
    }

    if let Some(value) = clean(&metadata.copyright) {
        args.push(format!("-EXIF:Copyright={value}"));
        args.push(format!("-IPTC:CopyrightNotice={value}"));
    }

    if let Some(value) = clean(&metadata.comment) {
        args.push(format!("-EXIF:UserComment={value}"));
        args.push(format!("-EXIF:XPComment={value}"));
        args.push(format!("-Comment={value}"));
    }

    args.push(output_file.to_string());

    args
}

fn clear_xmp_lang_alt_fields(args: &mut Vec<String>) {
    for field in [
        "XMP-dc:Title",
        "XMP-dc:Description",
        "XMP-dc:Rights",
        "XMP-dc:Creator",
        "XMP-dc:Subject",
    ] {
        args.push(format!("-{field}="));
    }
}

fn clean(value: &Option<String>) -> Option<String> {
    value
        .as_ref()
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
}

fn split_keywords(value: &str) -> Vec<String> {
    value
        .split([',', '،', ';'])
        .map(str::trim)
        .filter(|item| !item.is_empty())
        .map(ToOwned::to_owned)
        .collect()
}

pub fn shell_join(tool: &str, args: &[String]) -> String {
    std::iter::once(tool.to_string())
        .chain(args.iter().map(|arg| shell_escape(arg)))
        .collect::<Vec<_>>()
        .join(" ")
}

fn shell_escape(value: &str) -> String {
    if value
        .chars()
        .all(|character| character.is_ascii_alphanumeric() || "-_./:@=,".contains(character))
    {
        value.to_string()
    } else {
        format!("'{}'", value.replace('\'', "'\\''"))
    }
}
