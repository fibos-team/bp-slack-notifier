> BP SLACK NOTIFIER



## User Story

### MUST HAVE

- [ ] 1. 我可以添加 slack 机器人『fibosbot』;
- [ ] 1. 我可以通过 slack 接收我的 BP 节点的状态变化（online/offline/over21）;
- [ ] 2. 我可以通过 slack 接收我的 BP 节点的投票排名变化通知以及谁增加/减少了投票；

### COULD HAVE

- [ ] 1. 我可以通过 slack 接收我的 RPC/P2P server 的状态变化;
- [ ] 2. 我可以在 slack 输入指令 `/status` 查询我的 BP 现在的状态以及投票排名、详细的投票数据；
- [ ] 3. 我可以在 slack 输入指令 `/history` 查看我的 BP 每一天的状态变化以及每天收益情况等等；
- [ ] 3. 我可以在 slack 输入指令 `/rpclist` 查看所有可用的 rpc list；


### NICE HAVE



### API 相关信息查询


1. BP 状态： `online`, `offline`, `over21`


2. 如何查询当前 BP 是出块节点？

  - 通过 `POST http://api.fibos.team/v1/chain/get_producers {json: true}` 查看节点在 rows 所在数组顺序, 如果其在数组前21位且 `is_active ===1` 则为出块节点

  ```json
  {
      "rows": [
          {
              "owner": "liuqiangdong",
              "total_votes": "355779704116639936.00000000000000000",
              "producer_key": "FO5RpGum8RXE5RGEUpi3hRYP5Dype45gn8EjoJuYsota6gBMLkzv",
              "is_active": 1,
              "url": "https://fibos.team",
              "unpaid_blocks": 7320,
              "last_claim_time": "1537875610000000",
              "location": 1
          }
      ],
      "total_producer_vote_weight": "10860130839026819072.00000000000000000",
      "more": "fibosrockets"
  }
  ```

2. 如果查询当前 BP 服务器出块正常？

  - `https://api.fibos.team/v1/chain/get_info` 拿到 head_block_num

    ```json
    {
      "server_version": "e87d245d",
      "chain_id": "6aa7bd33b6b45192465afa3553dedb531acaaff8928cf64b70bd4c5e49b7ec6a",
      "head_block_num": 4942785,
      "last_irreversible_block_num": 4942456,
      "last_irreversible_block_id": "004b6a78d96d290c38c5e694a30b127242dcdd65779e20a778ce2721ca2cd40f",
      "head_block_id": "004b6bc1699ca01c00449cd41b3313e014586e11ab0eaad17b6dd999f9ae35bb",
      "head_block_time": "2018-09-26T09:32:14.000",
      "head_block_producer": "fibosmoziben",
      "virtual_block_cpu_limit": 200000000,
      "virtual_block_net_limit": 1048576000,
      "block_cpu_limit": 199900,
      "block_net_limit": 1048576,
      "server_version_string": "v1.2.3-dirty"
    }
    ```
  - `https://api.fibos123.com/bp_info?bpname=${bpname}`  查询 last_block, 对比 head_block_num & last_block 如果在 12*21 之内则为 online 否则为 offline。

    ```json
    {
      "bpname": "liuqiangdong",
      "block_count": 211853,
      "first_time": "2018-08-31T14:10:24.000",
      "first_block": 579308,
      "last_time": "2018-09-26T09:59:29.500",
      "last_block": 4946056
    }
    ```



### Todos:


1. 每 30s 请求一次数据；