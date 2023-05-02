import { useState } from "react";
import { Space, Table, Tag } from "antd";
import ModalPopUpBuilder from "../components/ModalPopUpBuilder";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import ArmForm from "./ArmForm";
import CustomModalForm from "./CustomModalForm";
import convertBytes from "../utils/memoryConverter";

const TableBuiilder = ({ assetData }) => {
  const [selectedDeviceId, setSelectedDeviceID] = useState("");
  const [IsOpen, setModalShow] = useState(false);
  const columns = [
    {
      title: "DeviceId",
      dataIndex: "deviceid",
      key: "deviceid",
      render: (id) => (
        <Popup trigger={<a>{id}</a>} position="center">
          <CustomModalForm selectedID={id} />
        </Popup>
      ),
    },
    {
      title: "Licensed",
      dataIndex: "licensed",
      key: "licensed",
    },
    {
      title: "Collection Type",
      dataIndex: "data",
      key: "data",
      render: (data) => (
        <>{data && data.collection_type ? data.collection_type : "N/A"}</>
      ),
    },
    {
      title: "Device Type",
      dataIndex: "data",
      key: "data",
      render: (data) => (
        <>{data && data.devicetype ? data.devicetype : "N/A"}</>
      ),
    },

    {
      title: "IP Address",
      dataIndex: "data",
      key: "data",
      render: (data) => (
        <>{data && data.identifying_ip ? data.identifying_ip : "N/A"}</>
      ),
    },

    {
      title: "CPU Inventroy",
      dataIndex: "inventroy_cpu_hz",
      key: "inventroy_cpu_hz",
      render: (data) => <span>{convertBytes(data)}</span>,
    },

    {
      title: "CPU Usage",
      dataIndex: "usage_cpu_hz",
      key: "usage_cpu_hz",
      render: (data) => <span>{convertBytes(data)}</span>,
    },

    {
      title: "Inventroy Instance cost hour",
      dataIndex: "inventroy_instance_cost_hour",
      key: "inventroy_instance_cost_hour",
      render: (data) => (
        <p style={{ color: "black", fontWeight: "600" }}>
          <span
            style={{
              fontSize: "11px",
              color: "black",
              fontWeight: 400,
              position: "relative",
              bottom: "5px",
              right: "2px",
            }}
          >
            $
          </span>
          {data}
        </p>
      ),
    },

    {
      title: "Usage Instance cost hour",
      dataIndex: "usage_instance_cost_hour",
      key: "usage_instance_cost_hour",
      render: (data) => (
        <p style={{ color: "black", fontWeight: "600" }}>
          <span
            style={{
              fontSize: "11px",
              color: "black",
              fontWeight: 400,
              position: "relative",
              bottom: "5px",
              right: "2px",
            }}
          >
            $
          </span>
          {data}
        </p>
      ),
    },

    {
      title: "Stack",
      dataIndex: "stacks",
      key: "stacks",
      render: (stacks) => <span>{stacks && stacks[0].stack_name}</span>,
    },

    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => (
        <span style={{ color: "green" }}>{tags && tags.length}</span>
      ),
    },

    {
      title: "Interfaces",
      dataIndex: "data",
      key: "data",
      render: (data) => (
        <span style={{ color: "orange" }}>
          {data.interfaces && data.interfaces.length}
        </span>
      ),
    },
    //   {
    //     title: 'Tags',
    //     key: 'tags',
    //     dataIndex: 'tags',
    //     // render: (_, { tags }) => (
    //     //   <>
    //     //     {tags.map((tag) => {
    //     //       let color = tag.length > 5 ? 'geekblue' : 'green';
    //     //       if (tag === 'loser') {
    //     //         color = 'volcano';
    //     //       }
    //     //       return (
    //     //         <Tag color={color} key={tag}>
    //     //           {tag.toUpperCase()}
    //     //         </Tag>
    //     //       );
    //     //     })}
    //     //   </>
    //     // ),
    //   },
    //   {
    //     title: 'Action',
    //     key: 'action',
    //     render: (_, record) => (
    //       <Space size="middle">
    //         <a>Invite {record.deviceid}</a>
    //         <a>Delete</a>
    //       </Space>
    //     ),
    //   },
  ];

  const handleRowClick = (deviceID) => {
    console.log(`=================> inside selected row handler ${deviceID}`);
    event.stopPropagation();
    setSelec;
  };

  const handleOpenModal = () => {
    setModalShow(true);
  };

  return (
    <div className="table_container">
      <Table
        rowKey={assetData.deviceid}
        columns={columns}
        dataSource={assetData}
      />
    </div>
  );
};

export default TableBuiilder;
