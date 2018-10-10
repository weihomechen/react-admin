import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { List, Form, Modal, Input } from 'antd';
import { connect } from 'dva';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const passwordStrength = {
  strong: (
    <font className="strong">
      <FormattedMessage id="app.settings.security.strong" defaultMessage="Strong" />
    </font>
  ),
  medium: (
    <font className="medium">
      <FormattedMessage id="app.settings.security.medium" defaultMessage="Medium" />
    </font>
  ),
  weak: (
    <font className="weak">
      <FormattedMessage id="app.settings.security.weak" defaultMessage="Weak" />
      Weak
    </font>
  ),
};

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
@Form.create()
class SecurityView extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      type: 'pwd',
    };
  }

  showModal = () => {
    this.setState({ modalVisible: true, type: 'pwd' });
  };

  getData = () => [
    {
      title: formatMessage({ id: 'app.settings.security.password' }, {}),
      description: (
        <Fragment>
          {formatMessage({ id: 'app.settings.security.password-description' })}：
          {passwordStrength.strong}
        </Fragment>
      ),
      actions: [
        <a onClick={() => this.showModal('pwd')}>
          <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'app.settings.security.phone' }, {}),
      description: `${formatMessage(
        { id: 'app.settings.security.phone-description' },
        {}
      )}：18888888888`,
      actions: [
        <a onClick={() => this.showModal('mobile')}>
          <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'app.settings.security.question' }, {}),
      description: formatMessage({ id: 'app.settings.security.question-description' }, {}),
      actions: [
        <a onClick={() => this.showModal('security')}>
          <FormattedMessage id="app.settings.security.set" defaultMessage="Set" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'app.settings.security.email' }, {}),
      description: `${formatMessage(
        { id: 'app.settings.security.email-description' },
        {}
      )}：ant***sign.com`,
      actions: [
        <a onClick={() => this.showModal('mail')}>
          <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'app.settings.security.mfa' }, {}),
      description: formatMessage({ id: 'app.settings.security.mfa-description' }, {}),
      actions: [
        <a onClick={() => this.showModal('MFA')}>
          <FormattedMessage id="app.settings.security.bind" defaultMessage="Bind" />
        </a>,
      ],
    },
  ];

  checkPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  getFormItems = type =>
    ({
      pwd: [
        {
          lable: '旧密码',
          key: 'oldPassword',
          inputType: 'password',
          rules: [
            {
              required: true,
              message: formatMessage({ id: 'app.settings.security.old-password' }, {}),
            },
          ],
        },
        {
          lable: '新密码',
          key: 'password',
          inputType: 'password',
          rules: [
            {
              required: true,
              message: formatMessage({ id: 'app.settings.security.new-password' }, {}),
            },
          ],
        },
        {
          lable: '确认密码',
          key: 'confirm',
          inputType: 'password',
          rules: [
            {
              required: true,
              message: formatMessage({ id: 'app.settings.security.confirm-password' }, {}),
            },
            {
              validator: this.checkPassword,
            },
          ],
        },
      ],
      mobile: [],
      security: [],
      mail: [],
      MFA: [],
    }[type]);

  hideModal = () => {
    this.setState({ modalVisible: false });
  };

  submit = () => {
    const { form, dispatch } = this.props;
    const { type } = this.state;

    form.validateFields((error, values) => {
      if (!error) {
        dispatch({
          type: 'user/updateSecurity',
          payload: {
            ...values,
            type,
          },
        }).then(success => {
          if (success) {
            this.setState({ modalVisible: false });
          }
        });
      }
    });
  };

  render() {
    const { modalVisible, type } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
        <Modal
          title="修改设置(目前先实现修改密码)"
          visible={modalVisible}
          onCancel={this.hideModal}
          onOk={this.submit}
          destroyOnClose
        >
          <Form>
            {this.getFormItems(type).map(item => {
              const { lable, key, inputType, rules } = item;
              return (
                <FormItem label={lable} key={key} {...formItemLayout}>
                  {getFieldDecorator(key, {
                    rules,
                  })(<Input type={inputType} />)}
                </FormItem>
              );
            })}
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default SecurityView;
