import { React, useEffect, useState } from "react";
import Axios from "axios";
import Spinner from "./Spinner";
import mainLogo from "./azureIcon.png";
import ModalPopUpBuilder from "./components/ModalPopUpBuilder";
import JSONPretty from "react-json-pretty";
import "react-json-pretty/themes/monikai.css";
import convertJsonToExcel from "./utils/JsonToExcel";
import jsonConverter from "./utils/DataToJson";
import "./arm.css";
import ArmForm from "./components/ArmForm";
import { Input, Button, Space } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import convertBytes from "./utils/memoryConverter";
import { Select } from "antd";
import osVersionList from "./utils/OsVersionList";
import customWinArmTemplate from "./armtemplate/windowsTemplate";
import customLinuxArmTemplate from "./armtemplate/linuxTemplate";
import SweetAlert from "sweetalert-react";
import "sweetalert/dist/sweetalert.css";
import { Progress } from "react-sweet-progress";
import "react-sweet-progress/lib/style.css";
import TableBuiilder from "./components/TableBuilder";
import StackTable from "./components/stackTable";
import { Card, Col, Row } from "antd";
import RadioButtonBuilder from "./components/RadioButtonBuilder";

const ArmDashboard = () => {
  const [assetList, setAssetList] = useState("");
  const [searchResult, setSearchResultData] = useState("");
  const [stackResult, setStackResult] = useState("");
  const [preetyData, setPrettyData] = useState({});
  const [loading, setLoading] = useState(false);
  const [deviceID, setDeviceID] = useState("");
  const [stackID, setStackID] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [keyAttribute, setKeyAttribute] = useState([]);
  const [fieldVal, setFieldVal] = useState([]);
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [nickName, setNickName] = useState("");
  const [networkSecurityGroupName, setNetworkSecurityGrpName] = useState("");
  const [storageAccountName, setStorageAccountName] = useState("");
  const [virtualNetworkName, setVirtualNetworkName] = useState("");
  const [isDisabled, setIsdisabled] = useState(true);
  const [osVersion, setOsVersion] = useState([]);
  const [armformdata, setArmRightForm] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showProgress, setShowProgress] = useState("none");
  const [sucessRate, setBarSucessRate] = useState(20);
  const [progressStatus, setProgressStatus] = useState("active");
  const [operatingSystemVersion, setOperatingSystemVersion] = useState("");
  const [btnEnable, setDownloadTemplateBtnEnabled] = useState(false);
  const [checkedValue, setRadioValue] = useState(1);
  const [isBtnDisable, setIsBtnDisable] = useState(true);
  const [iaasPrice, setIaaSprice] = useState([]);
  const [assetDetailWithPrice, setAssetDetailWithIaasPrice] = useState("");

  const API_KEY = process.env.REACT_APP_API_KEY;

  const providerOptionList = [
    { value: "2", label: "Azure US Zone" },
    { value: "1", label: "Azure India Zone" },
    { value: "4", label: "Azure India Zone" },
    { value: "disabled", label: "Disabled", disabled: true },
  ];

  /*inline styles */

  const centred = {
    height: "50px",
    left: "50%",
    position: "absolute",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    zIndex: 10,
  };

  const getData = async () => {
    const response = await Axios.get(
      `${API_KEY}/getAssetDetails?deviceid=${deviceID}`
    );
    //setAccess(response.data[0]);
    const output = JSON.parse(response.data.body);
    const formatedData = JSON.stringify(output, null, "\t");
    //  console.log("flexera asset data fetch async call ====>",JSON.parse(formatedData))
    const parsedData = JSON.parse(formatedData);
    // console.log("strigify data", parsedData);
    // console.log("user access data: ",parsedData.assets[0]);
    setLoading(false);
    setAssetList(parsedData);
    const arrKey = [];
    assetList.assets &&
      Object.entries(assetList.assets[0].data).map((item) =>
        arrKey.push(item[0])
      );
    setKeyAttribute(arrKey);
    const arrVal = [];
    assetList.assets &&
      Object.entries(assetList.assets[0].data).map((item) =>
        arrVal.push(item[1])
      );
    setFieldVal(arrVal);
    //setOperatingSystemVersion(assetList.assets[0].data.os_version);
    // console.log("test json data before format====> ", jsonData)
    // const myJSON = {ans: 42};
    // const formatter = new JSONFormatter(assetList);
    // document.body.appendChild(formatter.render());
  };

  const getAssetDataByStack = async (selectedStackId) => {
    setLoading(true);
    const res = await Axios.get(
      `${API_KEY}/getAssetDetailsByStackId?stackid=${selectedStackId}`
    );
    //setAccess(response.data[0]);
    const output = JSON.parse(res.data.body);
    const formatedData = JSON.stringify(output, null, "\t");
    //  console.log("flexera asset data fetch async call ====>",JSON.parse(formatedData))
    const parsedData = JSON.parse(formatedData);
    // console.log("strigify data", parsedData);
    console.log("user access data for selected stack id: ", parsedData.assets);
    const filter = {
      filter_by: "stack",
      filter_ids: [parseInt(searchKey)],
      providerids: [2],
    };
    setLoading(true);
    const response = await fetch(`${API_KEY}/getIaaSprice`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filters: filter }),
    });
    const priceDetail = await response.json();

    setIaaSprice(priceDetail);
    // console.log("Inventroy pricing detail data: ", iaasPrice.inventroyList);
    // console.log("usage iaas pricing detail data: ", iaasPrice.usageList);
    const inventoryArr = priceDetail.inventroyList;
    const usageArr = priceDetail.usageList;
    // const inventoryArr = [];
    const allStackSearchResult =
      parsedData.assets &&
      parsedData.assets.map((ele, i) => ({
        ...ele,
        inventroy_cpu_hz: inventoryArr[i].cpu_hz,
        usage_cpu_hz: usageArr[i].cpu_hz,
        inventroy_instance_cost_hour: inventoryArr[i].instance_cost_hour,
        usage_instance_cost_hour: usageArr[i].instance_cost_hour,
      }));
    // iaasPrice && iaasPrice.map((item, index)=> {
    //   inventoryArr.push(item[index].cpu_hz)
    // })

    console.log(
      `asset detail with price ${JSON.stringify(
        allStackSearchResult,
        null,
        " "
      )}`
    );
    setAssetDetailWithIaasPrice(allStackSearchResult);
    setLoading(false);
    // setSearchResultData(parsedData);
    // setSearchKey("");
    setLoading(false);
    setStackResult(parsedData);
  };

  const getAllAssetData = async () => {
    setLoading(true);
    const response = await Axios.get(
      `${API_KEY}/getAssetDetailBySerach?searchkey= ${searchKey}`
    );
    const res = await JSON.parse(response.data.body);
    const formatedData = JSON.stringify(res, null, "\t");
    const parsedData = JSON.parse(formatedData);
    console.log("all asset detail data: ", parsedData.assets);
    getIaaSpricingByStackIdAndProviderId();
    setLoading(false);
    setSearchResultData(parsedData);
    setSearchKey("");
  };

  // function not in use
  const getIaaSpricingByStackIdAndProviderId = async () => {
    const filter = {
      filter_by: "stack",
      filter_ids: [parseInt(searchKey)],
      providerids: [2],
    };
    setLoading(true);
    const response = await fetch(`${API_KEY}/getIaaSprice`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filters: filter }),
    });
    const priceDetail = await response.json();

    setIaaSprice(priceDetail);
    // console.log("Inventroy pricing detail data: ", iaasPrice.inventroyList);
    // console.log("usage iaas pricing detail data: ", iaasPrice.usageList);
    const inventoryArr = priceDetail.inventroyList;
    const usageArr = priceDetail.usageList;
    // const inventoryArr = [];
    const allStackSearchResult =
      stackResult.assets &&
      stackResult.assets.map((ele, i) => ({
        ...ele,
        inventroy_cpu_hz: inventoryArr[i].cpu_hz,
        usage_cpu_hz: usageArr[i].cpu_hz,
      }));
    // iaasPrice && iaasPrice.map((item, index)=> {
    //   inventoryArr.push(item[index].cpu_hz)
    // })

    console.log(
      `asset detail with price ${JSON.stringify(
        allStackSearchResult,
        null,
        " "
      )}`
    );
    setAssetDetailWithIaasPrice(allStackSearchResult);
    setLoading(false);
    // setSearchResultData(parsedData);
    // setSearchKey("");
  };
  useEffect(() => {
    //For Access control
    // getData();
    //console.log("test optionList", osVersionList.windowsOsVersionList)
    // const filteredList = assetList.assets && assetList.assets[0].data.os === 'Linux' ? osVersionList.linuxOsVersionList : osVersionList.windowsOsVersionList;
    // console.log(`os versijn list ${JSON.stringify(filteredList, null, "")}`)
    // setOsVersionOption(filteredList);
  }, []);

  //   setInterval(function() {
  //     //  I will run for every 15 minutes
  //  getData()
  //    }, 15 * 60 * 1000);
  //console.log(`check status detail ${JSON.stringify(assetList)}`);

  //console.log("data object==>", Object.entries(assetList.assets[0].data).map((item)=>item[0]))

  const test = [2, 6, 7];
  // test.map((item)=>arrKey.push(item))
  //console.log(`arrkey data ${arrKey.includes("device_issues")}`)

  //console.log(`test objjects ${ assetList.assets && Object.entries(assetList.assets[0].data).map((item)=>item[0])== "device_issues"}`)

  const handleSubmit = () => {
    setLoading(true);
    getData();
    setOsVersion({
      value: assetList.assets && assetList.assets[0].data.os_version,
    });
  };

  const handleGlobalSearch = () => {
    setLoading(true);
    checkedValue === 1 ? getAllAssetData() : getAssetDataByStack(searchKey);
  };

  const handleConverter = () => {
    // convertJsonToExcel(assetList.assets);
    setCount(count + 1);
    const time = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    jsonConverter(assetList.assets, `assetList${time}`);
    alert("report generated");
  };

  const onOsVersionChange = (value, label) => {
    console.log(`selected ${value}`);
    setOperatingSystemVersion(label);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };

  const handleStackCardClick = (stackCardId) => {
    console.log(`inside handle card click ====> ${stackCardId}`);
    getAssetDataByStack(stackCardId);
  };

  const handleGlobalChange = (event) => {
    setStackResult("");
    setSearchResultData("");
    setSearchKey(event.target.value);
  };
  // const createCustomArmTemplate = (customTemplate) => {
  //   const time = new Date().toLocaleTimeString("en-US", {
  //     hour12: false,
  //     hour: "numeric",
  //     minute: "numeric",
  //     second: "numeric",
  //   });
  //   jsonConverter(customTemplate, `deploymentTemplate${time}`);
  //   alert("template created ");
  // }

  const handleCreateTemplate = () => {
    setBarSucessRate(50);
    setProgressStatus("active");
    // setLoading(true);
    setShowAlert(true);
    setShowProgress("flex");
    let armJson = {};
    if (assetList.assets) {
      armJson = {
        os: assetList.assets[0].data.os,
        osDefaultVersion: assetList.assets[0].data.os_version,
        osVersion: operatingSystemVersion,
        vmSize: convertBytes(
          assetList.assets[0].data.storage
            ? assetList.assets[0].data.storage[0].storage_size_bytes
            : assetList.assets[0].data.disks[0].disk_size_bytes
        ),
        vmName: assetList.assets[0].data.hostname,

        nicName: nickName,
        virtualNetworkName: virtualNetworkName,
        networkSecurityGroupName: networkSecurityGroupName,
        storageAccountName: storageAccountName,
      };
    }

    setArmRightForm(armJson);
    console.log(`arm json data ${JSON.stringify(armJson, null, " ")}`);
    //console.log("test custome arm json data",customWinArmTemplate(armJson));
    setTimeout(() => {
      setBarSucessRate(80);
      setProgressStatus("active");
    }, 1000);

    setTimeout(() => {
      setBarSucessRate(90);
      setProgressStatus("active");
    }, 1000);

    setTimeout(() => {
      setBarSucessRate(100);
      setProgressStatus("success");
    }, 1000);

    setTimeout(() => {
      setShowProgress("none");
      setDownloadTemplateBtnEnabled(true);
    }, 2000);
  };

  const handleReset = () => {
    setNickName("");
    setVirtualNetworkName("");
    setStorageAccountName("");
    setNetworkSecurityGrpName("");
    setOperatingSystemVersion("");
    setDownloadTemplateBtnEnabled(false);
    //setOsVersionOption("")
  };

  const handleDownloadTemplate = () => {
    setBarSucessRate(50);
    setProgressStatus("active");
    // setLoading(true);
    setShowAlert(true);
    setShowProgress("flex");
    setTimeout(() => {
      setBarSucessRate(80);
      setProgressStatus("active");
    }, 1000);

    setTimeout(() => {
      setBarSucessRate(90);
      setProgressStatus("active");
    }, 1000);

    setTimeout(() => {
      setBarSucessRate(100);
      setProgressStatus("success");
    }, 1000);

    setTimeout(() => {
      setShowProgress("none");
      const arm =
        assetList.assets && assetList.assets[0].data.os === "Linux"
          ? customLinuxArmTemplate(armformdata)
          : customWinArmTemplate(armformdata);
      const time = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
      jsonConverter(arm, `deploymentTemplate${time}`);
    }, 2000);
  };

  const handleRadioChange = (e) => {
    setStackResult("");
    setAssetDetailWithIaasPrice("");
    setSearchResultData("");
    setSearchKey(""); // clear input field on radio btn toggle
    setIsBtnDisable(true);
    setRadioValue(e.target.value);
  };

  const handleProviderChange = (value) => {
    console.log(`provider selected  ${value}`);
  };

  // dashboard lolading....
  return (
    <div className="main">
      <div className="dashboard">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            boxShadow: "2px -1px 4px 1px rgb(0 0 0 / 20%)",
          }}
        >
          <img
            style={{ width: "50px", height: "50px" }}
            src={mainLogo}
            alt="fireSpot"
          />
          <h3 style={{ color: "orange" }}>ARM Template Dashboard</h3>
        </div>
        <div style={centred}>
          <div
            className="progress-bar"
            style={{
              display: showProgress,
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <Progress
              type="circle"
              // width={90}
              percent={sucessRate}
              status={progressStatus}
            />
          </div>
        </div>

        <h4
          style={{
            display: "flex",
            justifyContent: "center",
            color: "#05b105",
          }}
        >
          {assetList.returnStatusDetail}
        </h4>
        <div
          //style={{ display: "flex", justifyContent: "space-evenly" }}
          className="main-header"
        >
          <div
            className="sub-heading"
            style={{ display: "flex", justifyContent: "center" }}
          >
            {/* <div>Enter HostName, IP, Application Name to get Asset List</div> */}
            <RadioButtonBuilder
              value={checkedValue}
              handleRadioChange={handleRadioChange}
            />
          </div>
          <div
            className="asset-type"
            style={{
              display: "flex",
              justifyContent: "center",
              // marginRight: "1rem",
            }}
          >
            {/* <div className="input-field">
              <span style={{ padding: "1rem" }}>
                Get Asset Data By DeviceID
              </span>
              <Input
                style={{
                  border: "2px solid orange",
                  width: "300px",
                  padding: "0.5rem",
                  borderRadius: "3px",
                }}
                name="deviceid"
                value={deviceID}
                placeholder="Get Asset Data By DeviceID"
                onChange={(event) => setDeviceID(event.target.value)}
              ></Input>
            </div> */}
            {/* <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginRight: "1rem",
                padding: "1%",
              }}
              className="template-btn"
            >
              <Button
                type="primary"
                style={{ marginLeft: "8px" }}
                name="create_template"
                onClick={handleSubmit}
              >
                Submit
              </Button>
              {assetList.assets && (
                <div className="btn-report">
                  <Space wrap>
                    <Button
                      type="primary"
                      style={{ marginLeft: "8px" }}
                      onClick={handleConverter}
                      icon={<DownloadOutlined />}
                      // size={size}
                    ></Button>
                  </Space>
                </div>
              )}
            </div> */}
          </div>

          {/* assetlist for stack handler */}

          <div
            className="asset-type"
            style={{
              display: "flex",
              justifyContent: "center",
              // marginTop: "1%",
            }}
          >
            <div className="input-field">
              <Input
                style={{
                  margin: 0,
                }}
                name="search"
                value={searchKey}
                placeholder={
                  checkedValue === 1 ? "Enter hostName" : "Enter Stack ID"
                }
                onChange={handleGlobalChange}
                //onChange={(event) => setSearchKey(event.target.value)}
              ></Input>
            </div>

            {/* provider selection section */}

            <div className="provider_select">
              <Select
                mode="multiple"
                allowClear
                required={true}
                rules={[
                  {
                    required: true,
                    message: "Please select atleast one provider",
                  },
                ]}
                style={{ width: "100%", margin: 0 }}
                placeholder="Please select Providers"
                defaultValue={[]}
                onChange={handleProviderChange}
                options={providerOptionList}
                maxTagCount="responsive"
              />
            </div>

            {/* main dashboard button section starts here */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginRight: "1rem",
                //padding: "1%",
              }}
              className="template-btn"
            >
              <Button
                type="primary"
                disabled={!searchKey}
                style={{ marginLeft: "8px" }}
                name="create_template"
                onClick={handleGlobalSearch}
              >
                Submit
              </Button>
              {assetList.assets && (
                <div className="btn-report">
                  <Space wrap>
                    <Button
                      type="primary"
                      style={{ marginLeft: "8px" }}
                      onClick={handleConverter}
                      icon={<DownloadOutlined />}
                      // size={size}
                    ></Button>
                  </Space>
                </div>
              )}
            </div>
            {/* main dashboard button section end here */}
          </div>
        </div>
      </div>
      {loading === true ? (
        <Spinner load={loading} />
      ) : (
        searchResult.assets &&
        searchResult.assets[0].stacks && (
          // <div
          //   style={{
          //     borderTop: "2px solid rgb(247 251 255)",
          //     marginTop: "1rem",
          //     background: "rgb(247 251 255)",
          //   }}
          //   className="list-item"
          // >
          //   <div className="grid-sec" style={gridHeader}>
          //     <div
          //       style={{
          //         fontSize: "1.2rem",
          //         color: "#ffa64a",
          //         fontWeight: "400",
          //       }}
          //       className="grid-header"
          //     >
          //       Azure Resource Manager
          //     </div>
          //   </div>

          //   <div
          //     style={{ display: "flex", justifyContent: "center", marginTop:"1%" }}
          //     className="form-container"
          //   >
          //     {/*  display risc data */}
          //     <div className="arm-form">
          //       <label>Cpu Architecture :</label>{" "}
          //       <Input
          //         type="text"
          //         style={inputStyle}
          //         placeholder=""
          //         name="cpu_architecture"
          //         title="cpu_architecture"
          //         disabled
          //         defaultValue={
          //           assetList.assets &&
          //           assetList.assets[0].data.cpu_architecture
          //         }
          //       />
          //       <label>Cpu Count: </label>
          //       <Input
          //         type="text"
          //         style={inputStyle}
          //         placeholder=""
          //         disabled
          //         title="cpu_count"
          //         name="cpu_count"
          //         defaultValue={
          //           assetList.assets && assetList.assets[0].data.cpu_count
          //         }
          //       />
          //       <label>Memory: </label>
          //       <Input
          //         type="text"
          //         style={inputStyle}
          //         placeholder=""
          //         disabled
          //         title="memory"
          //         name="memory"
          //         defaultValue={
          //           assetList.assets &&
          //           convertBytes(assetList.assets[0].data.memory)
          //         }
          //       />
          //       <label>Dist Full: </label>
          //       <Input
          //         type="text"
          //         style={inputStyle}
          //         placeholder=""
          //         disabled
          //         title="dist_full"
          //         name="dist_full"
          //         defaultValue={
          //           assetList.assets && assetList.assets[0].data.dist_full
          //         }
          //       />
          //       <label>Identifying ip: </label>
          //       <Input
          //         type="text"
          //         style={inputStyle}
          //         placeholder=""
          //         disabled
          //         title="identifying_ip"
          //         name="identifying_ip"
          //         defaultValue={
          //           assetList.assets && assetList.assets[0].data.identifying_ip
          //         }
          //       />
          //       <label>Location Name: </label>
          //       <Input
          //         type="text"
          //         style={inputStyle}
          //         placeholder=""
          //         disabled
          //         title="location_name"
          //         name="location_name"
          //         defaultValue={
          //           assetList.assets &&
          //           assetList.assets[0].location[0].location_name
          //         }
          //       />
          //       <label>Stack Name: </label>
          //       <Input
          //         type="text"
          //         style={inputStyle}
          //         placeholder=""
          //         disabled
          //         title="stackName"
          //         name="stackName"
          //         defaultValue={
          //           assetList.assets && assetList.assets[0].stacks[0].stack_name
          //         }
          //       />
          //       <label>StackID: </label>
          //       <Input
          //         type="text"
          //         style={inputStyle}
          //         placeholder=""
          //         disabled
          //         title="stackid"
          //         name="stackid"
          //         defaultValue={
          //           assetList.assets && assetList.assets[0].stacks[0].stackid
          //         }
          //       />
          //     </div>

          //     {/* Arm form start */}
          //     <div
          //       style={{ marginLeft: "2%", borderLeft: "2px solid #e9e9e9" }}
          //       className="risc-form"
          //     >
          //       <label>vmSize :</label>{" "}
          //       <Input
          //         style={inputStyle}
          //         type="text"
          //         placeholder=""
          //         disabled
          //         name="vmsize"
          //         title="vmSize"
          //         defaultValue={convertBytes(
          //           assetList.assets[0].data.storage
          //             ? assetList.assets[0].data.storage[0].storage_size_bytes
          //             : assetList.assets[0].data.disks[0].disk_size_bytes
          //         )}
          //       />
          //       <label>vmName : </label>
          //       <Input
          //         style={inputStyle}
          //         type="text"
          //         placeholder=""
          //         disabled
          //         title="vmName"
          //         defaultValue={assetList.assets[0].data.hostname}
          //         name="vmname"
          //       />
          //       <label>OS :</label>{" "}
          //       <Input
          //         type="text"
          //         style={inputStyle}
          //         placeholder=""
          //         name="os"
          //         title="OS"
          //         disabled
          //         defaultValue={assetList.assets[0].data.os}
          //       />
          //       {/* <label>OS Version : </label>
          //       <Input
          //         type="text"
          //         style={inputStyle}
          //         placeholder=""
          //         disabled
          //         title="os_version"
          //         name="os_version"
          //         defaultValue={assetList.assets[0].data.os_version}
          //       /> */}
          //       <label>OS Version : </label>
          //       <Select
          //         showSearch
          //         placeholder="Select OS Version"
          //         optionFilterProp="children"
          //         defaultValue={
          //           assetList.assets && assetList.assets[0].data.os_version
          //         }
          //         style={{ width: "100%" }}
          //         onChange={onOsVersionChange}
          //         onSearch={onSearch}
          //         filterOption={(input, option) =>
          //           (option?.label ?? "")
          //             .toLowerCase()
          //             .includes(input.toLowerCase())
          //         }
          //         options={
          //           assetList.assets && assetList.assets[0].data.os === "Linux"
          //             ? osVersionList.linuxOsVersionList
          //             : osVersionList.windowsOsVersionList
          //         }
          //       />
          //       <label>nicName :</label>{" "}
          //       <Input
          //         style={inputStyle}
          //         type="text"
          //         value={nickName}
          //         onChange={(e) => setNickName(e.target.value)}
          //         placeholder="Enter nicName"
          //         name="nicName"
          //         title="nicName"
          //       />
          //       <label>virtualNetworkName : </label>
          //       <Input
          //         style={inputStyle}
          //         type="text"
          //         value={virtualNetworkName}
          //         onChange={(e) => setVirtualNetworkName(e.target.value)}
          //         placeholder="Enter virtualNetworkName"
          //         title="virtualNetworkName"
          //         name="virtualNetworkName"
          //       />
          //       <label>networkSecurityGroupName :</label>{" "}
          //       <Input
          //         style={inputStyle}
          //         type="text"
          //         value={networkSecurityGroupName}
          //         onChange={(e) => setNetworkSecurityGrpName(e.target.value)}
          //         placeholder="Enter network Security GroupName"
          //         name="networkSecurityGroupName"
          //         title="ninetworkSecurityGroupNamecName"
          //       />
          //       <label>storageAccountName : </label>
          //       <Input
          //         style={inputStyle}
          //         type="text"
          //         value={storageAccountName}
          //         onChange={(e) => setStorageAccountName(e.target.value)}
          //         placeholder="Enter storage AccountName"
          //         title="storageAccountName"
          //         name="storageAccountName"
          //       />
          //       {assetList.assets && (
          //         <div
          //           className="btn-report"
          //           style={{
          //             display: "flex",
          //             justifyContent: "flex-end",
          //             marginBottom: "1rem",
          //           }}
          //         >
          //           <Space wrap>
          //             <Button
          //               type="primary"
          //               style={{ background: "orange", borderColor: "orange" }}
          //               onClick={handleReset}
          //             >
          //               {" "}
          //               Clear
          //             </Button>
          //           </Space>

          //           <Space wrap>
          //             <Button type="primary" onClick={handleCreateTemplate}>
          //               {" "}
          //               Create Template
          //             </Button>
          //           </Space>

          //           {btnEnable && (
          //             <Space wrap>
          //               <Button
          //                 type="primary"
          //                 style={{ background: "green", borderColor: "green" }}
          //                 onClick={handleDownloadTemplate}
          //                 icon={<DownloadOutlined />}
          //                 // size={size}
          //               >
          //                 Download Template
          //               </Button>
          //             </Space>
          //           )}
          //         </div>
          //       )}
          //     </div>
          //   </div>
          // </div>
          <div>
            {/* <div>device Id</div>
          {assetList.assets && assetList.assets.map((data)=> <div>{data.deviceid}</div>)} */}
            {/* {assetList.assets && <TableBuiilder assetData = {assetList.assets} />} */}
            {/* {assetList.assets && assetList.assets[0].stacks && <StackTable stackList = {assetList.assets[0].stacks}/>} */}

            <div
              className="stack-cards"
              style={{ display: "flex", justifyContent: "center" }}
            >
              {searchResult.assets &&
                searchResult.assets[0].stacks &&
                searchResult.assets[0].stacks.map((stack) => (
                  <ul
                    className="stackList-class"
                    onClick={() => handleStackCardClick(stack.stackid)}
                    key={stack.stackid}
                  >
                    <li>
                      <b>StackID:</b>
                      <span>{stack.stackid}</span>
                    </li>
                    <li>
                      <b>Stack Name:</b>
                      <span>{stack.stack_name}</span>
                    </li>
                  </ul>

                  //   <Row key = {stack.stackid}

                  //   gutter={16}
                  // >
                  //   <Card
                  //     title={stack.stackid}
                  //     bordered={false}
                  //     style={{
                  //       width: 300,
                  //       margin: "1rem"
                  //     }}
                  //   >
                  //     <p
                  //     onClick={() => handleStackCardClick(stack.stackid)}
                  //     ><b>Stack Name: </b>{stack.stack_name}</p>
                  //   </Card>{" "}
                  // </Row>
                ))}
            </div>

            {loading === true ? (
              <Spinner load={loading} />
            ) : (
              <div className="device-list-table">
                {stackResult.assets && (
                  <TableBuiilder assetData={stackResult.assets} />
                )}
              </div>
            )}
          </div>
        )
      )}

      {/* display result for stack id alone */}
      {!searchResult.assets && (
        <div className="device-list-table">
          {assetDetailWithPrice && (
            <TableBuiilder assetData={assetDetailWithPrice} />
          )}
        </div>
      )}

      {/* <SweetAlert
    show={showAlert}
    title="Demo"
    text="SweetAlert in React"
    onConfirm={() => setShowAlert(false)}
  /> */}
    </div>
  );
};

export default ArmDashboard;
