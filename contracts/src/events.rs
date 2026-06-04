use soroban_sdk::{contractevent, Symbol};

#[contractevent]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PlaceholderEvent {
    #[topic]
    pub topic: Symbol,
}
