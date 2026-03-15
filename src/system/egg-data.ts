import { EGG_SEED, Egg } from "#data/egg";
import type { EggSourceType } from "#enums/egg-source-types";
import type { EggTier } from "#enums/egg-type";
import type { SpeciesId } from "#enums/species-id";
import type { VariantTier } from "#enums/variant-tier";

export class EggData {
  public id: number;
  public tier: EggTier;
  public sourceType: EggSourceType;
  public hatchWaves: number;
  public timestamp: number;
  public variantTier: VariantTier;
  public isShiny: boolean;
  public species: SpeciesId;
  public eggMoveIndex: number;
  public overrideHiddenAbility: boolean;

  constructor(source: Egg | any) {
    this.tier = 3; // 强制设为 EggTier.LEGENDARY (传说级)
    this.isShiny = true; // 强制闪光
    this.hatchWaves = 0; // 孵化所需波次设为 0，打一轮就出
    this.overrideHiddenAbility = true; // 强制开启隐藏特性（梦特）
    
    // 如果你还想要特定颜色的闪光（Variant），可以加这一行
     this.variantTier = 2;
    const sourceEgg = source instanceof Egg ? (source as Egg) : null;
    this.id = sourceEgg ? sourceEgg.id : source.id;
    this.tier = sourceEgg ? sourceEgg.tier : (source.tier ?? Math.floor(this.id / EGG_SEED));
    // legacy egg
    if (source.species === 0) {
      // check if it has a gachaType (deprecated)
      this.sourceType = source.gachaType ?? source.sourceType;
    } else {
      this.sourceType = sourceEgg ? sourceEgg.sourceType : source.sourceType;
    }
    this.hatchWaves = sourceEgg ? sourceEgg.hatchWaves : source.hatchWaves;
    this.timestamp = sourceEgg ? sourceEgg.timestamp : source.timestamp;
    this.variantTier = sourceEgg ? sourceEgg.variantTier : source.variantTier;
    this.isShiny = sourceEgg ? sourceEgg.isShiny : source.isShiny;
    this.species = sourceEgg ? sourceEgg.species : source.species;
    this.eggMoveIndex = sourceEgg ? sourceEgg.eggMoveIndex : source.eggMoveIndex;
    this.overrideHiddenAbility = sourceEgg ? sourceEgg.overrideHiddenAbility : source.overrideHiddenAbility;
  }

  toEgg(): Egg {
    // Species will be 0 if an old legacy is loaded from DB
    if (!this.species) {
      return new Egg({
        id: this.id,
        hatchWaves: this.hatchWaves,
        sourceType: this.sourceType,
        timestamp: this.timestamp,
        tier: Math.floor(this.id / EGG_SEED),
      });
    }
    return new Egg({
      id: this.id,
      tier: this.tier,
      sourceType: this.sourceType,
      hatchWaves: this.hatchWaves,
      timestamp: this.timestamp,
      variantTier: this.variantTier,
      isShiny: this.isShiny,
      species: this.species,
      eggMoveIndex: this.eggMoveIndex,
      overrideHiddenAbility: this.overrideHiddenAbility,
    });
  }
}
