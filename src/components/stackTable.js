import { Space, Table, Tag } from 'antd';
const StackTable = ({stackList})=> {
    
    console.log(`assetdaat inside tableBuilder ===> ${JSON.stringify(stackList, null, " ")}`) 
    const columns = [
     {
       title: 'StackID',
       dataIndex: 'stackid',
       key: 'stackid',
      // render: (stacks) => <a>{stacks && stacks[0].stackid}</a>,
     },
       
     {
         title: 'Stack',
         dataIndex: 'stack_name',
         key: 'stack_name',
         //render: (stacks) => <>{stacks && stacks[0].stack_name}</>,
       }
    ]

    return (
        <Table columns={columns} dataSource={ stackList && stackList} />
    )
}

export default StackTable;