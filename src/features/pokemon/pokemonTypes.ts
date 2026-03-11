//api search at /pokemon
export interface PokemonPaginatedResourceResponse {
    data: Fuzzysort.KeyResults<NamedAPIResource<string>>;
    count: number,
    next: string,
    previous: string,
    results:  NamedAPIResource[]
}

export interface NamedAPIResource<T = string> {
  name: T;
  url: string;
}


//actual pokemon detail,  /pokemon/{id}
export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;

  abilities: PokemonAbility[];
  forms: NamedAPIResource<"PokemonForm">[];
  game_indices: VersionGameIndex[];
  held_items: PokemonHeldItem[];
  location_area_encounters: string;
  moves: PokemonMove[];

  past_types: PokemonTypePast[];
  past_abilities: PokemonAbilityPast[];
  past_stats: PokemonStatPast[];

  sprites: PokemonSprites;
  cries: PokemonCries;

  species: NamedAPIResource<"PokemonSpecies">;
  stats: PokemonStat[];
  types: PokemonType[];
}

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource<"Ability">;
}

export interface PokemonAbilityPast {
  generation: NamedAPIResource<"Generation">;
  abilities: PokemonAbility[] | null;
}

export interface PokemonType {
  slot: number;
  type: NamedAPIResource<"Type">;
}

export interface PokemonFormType {
  slot: number;
  type: NamedAPIResource<"Type">;
}

export interface PokemonTypePast {
  generation: NamedAPIResource<"Generation">;
  types: PokemonType[];
}

export interface PokemonStat {
  stat: NamedAPIResource<"Stat">;
  effort: number;
  base_stat: number;
}

export interface PokemonStatPast {
  generation: NamedAPIResource<"Generation">;
  stats: PokemonStat[];
}

export interface PokemonHeldItem {
  item: NamedAPIResource<"Item">;
  version_details: PokemonHeldItemVersion[];
}

export interface PokemonHeldItemVersion {
  version: NamedAPIResource<"Version">;
  rarity: number;
}

export interface PokemonMove {
  move: NamedAPIResource<"Move">;
  version_group_details: PokemonMoveVersion[];
}

export interface PokemonMoveVersion {
  move_learn_method: NamedAPIResource<"MoveLearnMethod">;
  version_group: NamedAPIResource<"VersionGroup">;
  level_learned_at: number;
  order: number;
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  front_female: string | null;
  front_shiny_female: string | null;

  back_default: string | null;
  back_shiny: string | null;
  back_female: string | null;
  back_shiny_female: string | null;
}

export interface PokemonCries {
  latest: string;
  legacy: string;
}

export interface VersionGameIndex {
  game_index: number;
  version: NamedAPIResource<"Version">;
}