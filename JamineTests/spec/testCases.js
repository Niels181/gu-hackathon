// This is a dummy test case to start with automated Javascript testing

describe('Unittest retrieve value from dict', function () {
  let inputDict = {};
  inputDict["key1"] = "ValueOne";
  inputDict["key2"] = "ValueTwo";
  let inputKey = "key1";
  let expected = "ValueOne";

  it('Returns ValueOne', function () {
      expect(retrieveDictValue(inputDict, inputKey)).toEqual(expected);
    });
  });