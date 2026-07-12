use crate::models::ToolPaths;

#[derive(Debug, Clone)]
pub struct AppSettings {
    pub tools: ToolPaths,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            tools: ToolPaths::default(),
        }
    }
}
