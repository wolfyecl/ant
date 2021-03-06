import React from 'react';
import { Table } from 'semantic-ui-react'
import DeployZookeeperModal from './zookeeper-add-modal';
import ViewZookeeperModal from './zookeeper-view-modal';
// import $ from  'jquery';
import axios from 'axios';
import Backend from '../conf';
import Modalinfo from '../home/modal-info';
import { CleanToken } from '../home/cookies';

class DeployZookeeper extends React.Component {

    constructor(props) {
      super(props);
      this.state = {};
    }

    // 获取zookeeper信息，并放入state中
    async componentDidMount() {
      var url = Backend + "api/zookeeper/getall/";
      let ZookeeperList = await axios.get(url);
      ZookeeperList = ZookeeperList.data;
      if (ZookeeperList.Status === "Success"){
        var Data = JSON.parse(ZookeeperList.Data);
        this.setState({
            ZookeeperList: Data
        });
      }else if (ZookeeperList.Status === "NoLogin") {
        CleanToken();
      }else{
        Modalinfo.fire(<p>请求数据失败</p>);
      }
    }

    // 刷新zookeeper列表
    refreshZookeeperList = async () => {
      var url = Backend + "api/zookeeper/getall/";
      let ZookeeperList = await axios.get(url)
      ZookeeperList = ZookeeperList.data;
      if (ZookeeperList.Status === "Success"){
        var Data = JSON.parse(ZookeeperList.Data);
        this.setState({
            ZookeeperList: Data
        });
      }else if (ZookeeperList.Status === "NoLogin") {
        CleanToken();
      }else{
        Modalinfo.fire(<p>刷新redis列表失败</p>);
      }
    }

    render() {
      return (
        <div>
            <Table fixed color="olive">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>集群名称</Table.HeaderCell>
                  <Table.HeaderCell>部署进度</Table.HeaderCell>
                  <Table.HeaderCell>备注</Table.HeaderCell>
                  <Table.HeaderCell>详情</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {this.state.ZookeeperList && this.state.ZookeeperList.map((zookeeper) => (
                  <Table.Row key={zookeeper.Id}>
                    <Table.Cell>
                      {zookeeper.ClusterName}
                    </Table.Cell>
                    <Table.Cell>
                      {zookeeper.DeployStatus}
                    </Table.Cell>
                    <Table.Cell>
                      {zookeeper.Remark}
                    </Table.Cell>
                    <Table.Cell>
                      <ViewZookeeperModal zookeeper={JSON.stringify(zookeeper)}  refreshZookeeperList={this.refreshZookeeperList} DeployStatus={zookeeper.DeployStatus}/>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
              <Table.Footer fullWidth>
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell colSpan='3'>
                    <DeployZookeeperModal refreshZookeeperList={this.refreshZookeeperList}/>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
        </div>

      );
    }
  }

export default DeployZookeeper;
