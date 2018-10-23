/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Form,
  Row,
  Col,
  Button,
  Input,
  Select,
  Card,
  Menu,
  Dropdown,
  Icon,
  Popconfirm,
} from 'antd';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import { userRoleMap, userStatusMap, DATE_FORMATTER } from '../../utils/utils';
import styles from './Manage.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ userManage, loading }) => ({
  userManage,
  loading: loading.models.userManage,
}))
@Form.create()
class UserManage extends Component {
  state = {
    querys: {},
    selectedRows: [],
    selectedRowKeys: [],
  };

  columns = [
    {
      title: '用户名',
      dataIndex: 'name',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      render: v => <img alt="" src={v} className={styles.avatar} />,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '地址',
      dataIndex: 'address',
      render: (v, r) => {
        const { geographic: { province = {}, city = {} } = {} } = r;
        return `${province.label || ''}${city.label || ''} ${v || ''}`;
      },
    },
    {
      title: '角色',
      dataIndex: 'role',
      render: v => userRoleMap[v],
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (v, r) => {
        const isActive = v === '1';
        return (
          <Popconfirm
            title={`确定${isActive ? '禁用' : '启用'}该用户？`}
            onConfirm={() => this.updateUser({ status: isActive ? '0' : '1' }, r._id)}
          >
            <Button className={isActive ? styles.activeUser : styles.disabledUser}>
              {userStatusMap[v]}
            </Button>
          </Popconfirm>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: v => moment(v).format(DATE_FORMATTER),
    },
    // {
    //   title: '更新时间',
    //   dataIndex: 'updatedAt',
    //   render: v => moment(v).format(DATE_FORMATTER),
    // }
  ];

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'userManage/getUsers',
    });
  }

  selectRowsChange = (selectedRows, selectedRowKeys) => {
    this.setState({
      selectedRows,
      selectedRowKeys,
    });
  };

  tableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { querys } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      sorter: sorter.field,
      sorterOrder: sorter.order,
      ...querys,
      ...filters,
    };

    dispatch({
      type: 'user/getUsers',
      payload: params,
    });
  };

  searchFormRender = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} lg={6} sm={18}>
            <FormItem label="用户名">
              {getFieldDecorator('name')(<Input style={{ width: 150 }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={18}>
            <FormItem label="手机号">
              {getFieldDecorator('mobile')(<Input style={{ width: 150 }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={18}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: 150 }}>
                  <Option value="0">禁用中</Option>
                  <Option value="1">启用中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={18}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.resetSearchForm}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  resetSearchForm = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      querys: {},
    });
    dispatch({
      type: 'userManage/getUsers',
      payload: {},
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState(
        {
          querys: values,
        },
        () => {
          dispatch({
            type: 'userManage/getUsers',
            payload: values,
          });
        }
      );
    });
  };

  updateUser = (val, _id) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'userManage/update',
      payload: { _id, ...val },
    });
  };

  batchUpdate = (val = {}) => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    const ids = selectedRowKeys.join(',');

    dispatch({
      type: 'userManage/updateByBatch',
      payload: { ids, ...val },
    });
  };

  render() {
    const {
      loading,
      userManage: { data },
    } = this.props;
    const { selectedRows } = this.state;

    const menu = (
      <Menu onClick={({ key }) => this.batchUpdate({ status: key })} selectedKeys={[]}>
        <Menu.Item key="1">设为启用</Menu.Item>
        <Menu.Item key="0">设为禁用</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderWrapper title="用户管理">
        <Card bordered={false}>
          <div className={styles.searchForm}>{this.searchFormRender()}</div>
          {selectedRows.length > 0 && (
            <div className={styles.operators}>
              <Dropdown overlay={menu}>
                <Button type="primary">
                  批量操作 <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
          )}
          <StandardTable
            rowKey="_id"
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={this.columns}
            onSelectRow={this.selectRowsChange}
            onChange={this.tableChange}
            className={styles.table}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default UserManage;
