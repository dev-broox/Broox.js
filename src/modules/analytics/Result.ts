/**
 * SingleValue.
 */
export interface SingleValue {
  /**
   * Label.
   */
  label: string,
  /**
   * Value.
   */
  value: number
}

/**
 * GroupValue.
 */
export interface GroupValue {
  /**
   * Label.
   */
  label: string,
  /**
   * Values.
   */
  values: SingleValue[]
}

/**
 * Profile.
 */
export interface Profile {
  /**
   * Traffic amount.
   */
  traffic: number,
  /**
   * Views number.
   */
  views: number,
  /**
   * Gender numbers.
   */
  gender: SingleValue[],
  /**
   * Age numbers.
   */
  age: SingleValue[],
  /**
   * Dwell time.
   */
  dwell: number,
  /**
   * Attention time.
   */
  attention: number,
  /**
   * Emotion numbers
   */
  emotion: SingleValue[]
}

/**
 * Product.
 */
export interface Product {
  /**
   * Interactions number.
   */
  interactions: number,
  /**
   * Interaction time.
   */
  interactionTime: number,
  /**
   * Most interacted product.
   */
  mostInteracted: string,
  /**
   * Product distribution.
   */
  productDistribution: SingleValue[]
}

/**
 * By.
 */
export interface By {
  attention?: SingleValue[],
  traffic?: SingleValue[],
  views?: SingleValue[],
  dwell?: SingleValue[],
  liftInteractions?: SingleValue[],
  liftTime?: SingleValue[],
  placeInteractions?: SingleValue[],
  placeTime?: SingleValue[],
  gender?: GroupValue[],
  age?: GroupValue[],
  productDistribution?: GroupValue[]
}