use serde::Serialize;
pub type AppResult<T> = Result<T, AppError>;
#[derive(Debug, Clone, Serialize)] pub struct AppError { pub message: String }
impl AppError { pub fn new(message: impl Into<String>) -> Self { Self { message: message.into() } } }
impl std::fmt::Display for AppError { fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result { write!(f, "{}", self.message) } }
impl std::error::Error for AppError {}
