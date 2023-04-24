const windowsOsVersionAllowedValues = [
  "2016-datacenter-gensecond",
  "2016-datacenter-server-core-g2",
  "2016-datacenter-server-core-smalldisk-g2",
  "2016-datacenter-smalldisk-g2",
  "2016-datacenter-with-containers-g2",
  "2016-datacenter-zhcn-g2",
  "2019-datacenter-core-g2",
  "2019-datacenter-core-smalldisk-g2",
  "2019-datacenter-core-with-containers-g2",
  "2019-datacenter-core-with-containers-smalldisk-g2",
  "2019-datacenter-gensecond",
  "2019-datacenter-smalldisk-g2",
  "2019-datacenter-with-containers-g2",
  "2019-datacenter-with-containers-smalldisk-g2",
  "2019-datacenter-zhcn-g2",
  "2022-datacenter-azure-edition",
  "2022-datacenter-azure-edition-core",
  "2022-datacenter-azure-edition-core-smalldisk",
  "2022-datacenter-azure-edition-smalldisk",
  "2022-datacenter-core-g2",
  "2022-datacenter-core-smalldisk-g2",
  "2022-datacenter-g2",
  "2022-datacenter-smalldisk-g2",
];
const windowsOsVersionList = [];
for (let i = 0; i < windowsOsVersionAllowedValues.length; i++) {
  windowsOsVersionList.push({
    value: i,
    label: windowsOsVersionAllowedValues[i],
  });
}
//   const windowsOsVersionList = allowedValues.map((index, item)=>optionList.push({value:"", label:"test"}))

const linuxOsVersionAllowedValues = [
  "Ubuntu-1804",
  "Ubuntu-2004",
  "Ubuntu-2204",
];

const linuxOsVersionList = [];

for (let i = 0; i < linuxOsVersionAllowedValues.length; i++) {
  linuxOsVersionList.push({ value: i, label: linuxOsVersionAllowedValues[i] });
}

export default { windowsOsVersionList, linuxOsVersionList };
