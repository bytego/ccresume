'use strict';

var SignContract = function () {

    LocalContractStorage.defineProperty(this, "collNums");

    LocalContractStorage.defineMapProperty(this, "coll");
    LocalContractStorage.defineMapProperty(this, "collIndex");

    LocalContractStorage.defineMapProperty(this, "proveNumsMap");
    LocalContractStorage.defineMapProperty(this, "signNumsMap");

    LocalContractStorage.defineProperty(this, "adminAddress");
};

SignContract.prototype = {
    init: function () {
        var netConfig = {
            mainnet: {
                admin: "n1PjUo1btMbhsozGGfZwFBsFj8Bs4mPd7EG"
            }
        }
        var runEnv = "mainnet"
        var envConfig = netConfig[runEnv]
        this.adminAddress = envConfig.admin

        this.collNums = 0
    },
    addColl: function (coll) {
        var fromUser = Blockchain.transaction.from;

        coll.fromUser = fromUser;
        coll.num = 0;
        coll.num1 = 0;

        this.proveNumsMap.set(fromUser, 0);
        this.signNumsMap.set(fromUser,0);

        this.coll.set(fromUser, coll)
        this.collIndex.set(this.collNums, fromUser)
        this.collNums += 1

        return {
            nums: this.collNums
        }
    },

    addProve : function (fromUser) {

        var num =  this.proveNumsMap.get(fromUser);

        num = num + 1;

        this.proveNumsMap.set(fromUser, num)

        var dbUser = this.coll.get(fromUser)
        if (dbUser) {
            //修改用户用户信息
            dbUser.num = num
            this.coll.set(fromUser, dbUser)
            return
        }

    },

    addSign : function (fromUser) {

        var num =  this.signNumsMap.get(fromUser);

        num = num + 1;

        this.signNumsMap.set(fromUser, num)

        var dbUser = this.coll.get(fromUser)
        if (dbUser) {
            //修改用户用户信息
            dbUser.num1 = num
            this.coll.set(fromUser, dbUser)
            return
        }

    },
    getCollList: function (limit, offset) {
        var result = {
            total: 0,
            coll: []
        }
        var total = this.collNums
        if (!total) {
            return result
        }
        result.total = total
        if (offset == -1) {
            offset = total - 1
        }

        for (var i = offset; i > offset - limit; i--) {
            var hash = this.collIndex.get(i)
            var coll = this.coll.get(hash)

            result.coll.push(coll)
        }
        return result
    },
    getColl: function (from) { //通过公司hash获取公司信息

        var coll = this.coll.get(from)

        return coll;
    },
    stats: function () { //查看系统状态
        var result = {
            collNums: this.collNums,
        }
        return result
    },
    withdraw: function (address, value) {
        //取钱
        var fromUser = Blockchain.transaction.from
        if (fromUser != this.adminAddress) {
            throw new Error("403")
        }

        var amount = new BigNumber(value * 1000000000000000000)
        var result = Blockchain.transfer(address, amount)
        return result
    },
}

module.exports = SignContract;
