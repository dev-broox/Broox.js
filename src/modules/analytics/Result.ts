/**
 * Profile
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
 * SingleValue
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
 * GenderValue
 */
export interface GenderValue {
  label: string,
  male: number,
  female: number
}