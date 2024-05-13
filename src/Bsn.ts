export class Bsn {

  /**
   * Check if the provided value can be considered a (formally) valid BSN. No checks
   * are done to check if the BSN is actually in use.
   * This is described in https://www.rvig.nl/bsn/documenten/publicaties/2022/01/02/logisch-ontwerp-bsn-1.6
   */
  static validate(bsn: string): { success: boolean; message?: string } {
    if (!Number.isInteger(parseInt(bsn))) {
      return {
        success: false,
        message: 'provided BSN is not a number',
      };
    }
    if (bsn.length < 8 || bsn.length > 9) {
      return {
        success: false,
        message: `provided BSN is of incorrect length, provided length is ${bsn.length}`,
      };
    }
    if (!Bsn.elfproef(bsn)) {
      return {
        success: false,
        message: 'provided BSN does not satisfy elfproef',
      };
    }
    return {
      success: true,
    };
  }

  /**
   * All Dutch BSN's must conform to the 'elfproef'
   *
   * @param {string} bsn
   * @returns boolean true if value succeeds the elfproef
   */
  static elfproef(bsn: string) {
    const digits = bsn.split('');

    //Old BSN's can be 8 digits long
    if (digits.length == 8) { digits.unshift('0'); }
    let total = 0;
    digits.forEach((digitChar, i) => {
      const digit = parseInt(digitChar);
      if (i == digits.length - 1) {
        total += digit * -1;
      } else {
        total += digit * (digits.length - i);
      }
    });
    return (total % 11 == 0);
  }

  public bsn: string;
  /**
   * Utility class for using dutch BSN's
   *
   * Providing an invalid BSN to the class constructor
   * will throw an error.
   *
   * @param {string} bsn
   */
  constructor(bsn: string) {
    this.bsn = bsn;
    this.validate();
  }

  /** Validates the BSN. Called by the constructor.
   * @deprecated for direct use, call the static validate method `Bsn.validate(bsn: string)`, which
   * provides an error message and status, instead of throwing.
   */
  validate() {
    const result = Bsn.validate(this.bsn);
    if (result.success) {
      return;
    } else {
      throw Error(result.message);
    }
  }

  elfproef() {
    Bsn.elfproef(this.bsn);
  }
}
