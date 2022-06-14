export class Bsn {
  public bsn;
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

  /**
   * Check if the provided value can be considered a (formally) valid BSN. No checks
   * are done to check if the BSN is actually in use.
   * This is described in https://www.rvig.nl/bsn/documenten/publicaties/2022/01/02/logisch-ontwerp-bsn-1.6
   */
  validate() {
    if (!Number.isInteger(parseInt(this.bsn))) { throw Error('provided BSN is not a number'); }
    if (this.bsn.length < 8 || this.bsn.length > 9) { throw Error(`provided BSN is of incorrect length, provided length is ${this.bsn.length}`); }
    if (!this.elfproef()) { throw Error('provided BSN does not satisfy elfproef'); }
  }

  /**
   * All Dutch BSN's must conform to the 'elfproef'
   *
   * @param {string} bsn
   * @returns boolean true if value succeeds the elfproef
   */
  elfproef() {
    const digits = this.bsn.split('');

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
}