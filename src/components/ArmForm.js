import { Button, Checkbox, Form, Input } from 'antd';
const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
const ArmForm = () => (
  <Form
    name="basic"
    labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 16,
    }}
    style={{
      maxWidth: '75%',
    }}
    initialValues={{
      remember: true,
    }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="Schema"
      name="schema"
      disabled
      rules={[
        {
          required: true,
          message: 'Please select Schema!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="ContentVersion"
      name="contentVersion"
      rules={[
        {
          required: true,
          message: 'Please select ContentVersion!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="ApiProfile"
      name="apiProfile"
      rules={[
        {
         // required: true,
          message: 'Please select ApiProfiles!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Parameters"
      name="parameters"
      rules={[
        {
         // required: true,
          // message: 'Please select Parameters!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Resources"
      name="resources"
      rules={[
        {
          required: true,
          message: 'Please select resources!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Outputs"
      name="outputs"
      rules={[
        {
        //  required: true,
          // message: 'Please select outputs!',
        },
      ]}
    >
      <Input />
    </Form.Item>


    <Form.Item
      name="remember"
      valuePropName="checked"
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      {/* <Checkbox>I Agree</Checkbox> */}
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      {/* <Button type="primary" htmlType="submit">
        Submit
      </Button> */}
    </Form.Item>
  </Form>
);
export default ArmForm;