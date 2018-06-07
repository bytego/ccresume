'use strict';

var ResumeContract = function () {
    LocalContractStorage.defineProperty(this, "companyNums");
    LocalContractStorage.defineProperty(this, "reviewedCompanyNums");
    LocalContractStorage.defineProperty(this, "staffNums");

    // 公司信息
    LocalContractStorage.defineMapProperty(this, "company");
    LocalContractStorage.defineMapProperty(this, "companyIndex");
    // 保存公司是否审核通过
    LocalContractStorage.defineMapProperty(this, "reviewedCompany")
    //通过公司名查找对应的公司
    LocalContractStorage.defineMapProperty(this, "companyNameMap");
    //通过工商号查找对应的公司
    LocalContractStorage.defineMapProperty(this, "companyIdMap");

    // 公司管理员
    LocalContractStorage.defineMapProperty(this, "companyAdmin");
    LocalContractStorage.defineMapProperty(this, "companyAdminMap");
    //管理员是那个公司的
    LocalContractStorage.defineMapProperty(this, "adminCompanyMap");

    // 用户信息
    LocalContractStorage.defineMapProperty(this, "userInfo");

    // 员工工作信息
    LocalContractStorage.defineMapProperty(this, "staffResume");
    LocalContractStorage.defineMapProperty(this, "staffResumeNums");
    LocalContractStorage.defineMapProperty(this, "staffResumeIndex");

    // 公司信息
    LocalContractStorage.defineMapProperty(this, "companyStaff"); //保存这个员工是这个公司的
    LocalContractStorage.defineMapProperty(this, "companyStaffNums"); //保存公司员工数量
    LocalContractStorage.defineMapProperty(this, "companyStaffIndex"); //保存某个index出的员工身份证号码
    LocalContractStorage.defineProperty(this, "adminAddress");
};

ResumeContract.prototype = {
    init: function () {
        var netConfig = {
            mainnet: {
                admin: "n1Wtby3Pv2k66w9DMHaSmM7DYMFuqiQQcF8"
            },
            testnet: {
                admin: "n1J5YqDGzXbGNUwW9asuh4py2sjHr86XyHr"
            }
        }
        var runEnv = "mainnet"
        var envConfig = netConfig[runEnv]
        this.adminAddress = envConfig.admin

        this.companyNums = 0
        this.staffNums = 0
        this.reviewedCompanyNums = 0
    },
    _checkisAdmin: function (user) {
        if (user != this.adminAddress) {
            throw new Error("403")
        }
    },
    setUser: function (user) { //设置用户信息
        var fromUser = Blockchain.transaction.from,
            hash = Blockchain.transaction.hash,
            ts = Blockchain.transaction.timestamp,
            name = user.name;

        var userInfo = {
            address: fromUser,
            hash: hash,
            name: name,
            created: ts
        }
        var dbUser = this.userInfo.get(fromUser)
        if (dbUser) {
            dbUser.name = name
            this.userInfo.set(fromUser, dbUser)
            return
        }
        this.userInfo.set(fromUser, userInfo)
    },
    getUser: function (user) {
        var fromUser = Blockchain.transaction.from
        return this.userInfo.get(user || fromUser)
    },
    addCompany: function (company) { //公司申请
        var fromUser = Blockchain.transaction.from,
            hash = Blockchain.transaction.hash,
            ts = Blockchain.transaction.timestamp;
        //   TODO 缺少参数验证

        var companyId = company.companyId,
            companyName = company.name;

        var companyInfo = {
            hash: hash,
            name: companyName, //全称
            desc: company.desc, //简介
            established: company.established, //成立时间
            address: company.address, //企业地址
            industry: company.industry, //所属行业
            companyId: companyId, //工商企业号
            legalPerson: company.legalPerson, //法人
            website: company.website, //网址
            phone: company.phone, // 联系电话
            adminReviewMsg: "", //管理员的审核消息，比如说在官网放一个文件来验证公司
            logo: company.logo, //logo 网址
            fromUser: fromUser,
            created: ts
        }

        if (this.companyIdMap.get(companyId)) {
            throw new Error("10002")
        }

        this.company.set(hash, companyInfo)
        this.companyIndex.set(this.companyNums, hash)
        this.companyNums += 1

        this.companyIdMap.set(companyId, hash)
        this.companyNameMap.set(companyName, hash)

        this.adminCompanyMap.set(fromUser, hash)

        var userInfo = this.userInfo.get(fromUser)
        if (userInfo) {
            userInfo.isCompanyAdmin = true
            userInfo.companyHash = hash
            this.userInfo.set(fromUser, userInfo)
        } else {
            this.userInfo.set(fromUser, {
                address: fromUser,
                name: "",
                created: ts,
                isCompanyAdmin: true,
                companyHash: hash
            })
        }

        var companyAdmin = {}
        companyAdmin[fromUser] = {
            "name": "",
            "nasAddress": fromUser,
            "department": "",
            "note": "",
            "superuser": true
        }
        this.companyAdmin.set(hash, companyAdmin)
        return {
            nums: this.companyNums,
            hash: hash
        }
    },
    reviewCompany: function (hash, pass) { //审核公司
        var ts = Blockchain.transaction.timestamp,
            fromUser = Blockchain.transaction.from;
        this._checkisAdmin(fromUser)
        // var reviewedCompany = this.reviewedCompany.get(hash)
        this.reviewedCompany.set(hash, {
            created: ts,
            pass: pass //通过true，拒绝 fase
        })
        if (pass) {
            this.reviewedCompanyNums += 1
        }
    },
    _checkAuthUserCompany: function (companyHash, fromUser) {
        var reviewedCompany = this.reviewedCompany.get(companyHash)
        if (!(reviewedCompany && reviewedCompany.pass)) { //公司没审核通过
            throw new Error("10000")
        }
        // 检查操作者是不是公司的超级管理员
        var company = this.company.get(companyHash)
        if (company.fromUser == fromUser) {
            return true
        }

        // 检查是不是公司的管理员
        var k = companyHash + "." + fromUser
        var mapped = this.companyAdminMap.get(k)
        if (mapped) {
            return true
        }

        throw new Error("10001")
    },
    addCompanyAdmin: function (companyHash, admin) { //添加公司管理员
        // [{"name":"","nasAddress":"","department":"","note":""}]
        var fromUser = Blockchain.transaction.from,
            hash = Blockchain.transaction.hash,
            ts = Blockchain.transaction.timestamp;

        // LocalContractStorage.defineMapProperty(this, "companyAdmin");
        if (!admin.length) {
            return
        }
        this._checkAuthUserCompany(companyHash, fromUser)

        var companyAdmin = this.companyAdmin.get(companyHash) || {}
        for (var i = 0; i < admin.length; i++) {
            var item = admin[i],
                adminAddress = item.nasAddress,
                oldInfo = companyAdmin[adminAddress],
                itemAdmin = {
                    name: item.name,
                    nasAddress: adminAddress,
                    department: item.department,
                    note: item.note,
                    created: ts
                };
            if (oldInfo) {
                itemAdmin.superuser = oldInfo.superuser
            }

            companyAdmin[adminAddress] = itemAdmin

            var k = companyHash + "." + adminAddress
            var mapped = this.companyAdminMap.get(k)
            if (!mapped) {
                this.companyAdminMap.set(k, "1")
            }
            // 设置管理员是那个公司的
            this.adminCompanyMap.set(adminAddress, companyHash)

            // 如果没有员工信息保存员工简要信息
            var userInfo = this.userInfo.get(adminAddress)
            if (!userInfo) {
                this.userInfo.set(adminAddress, {
                    address: adminAddress,
                    name: item.name,
                    created: ts,
                    isCompanyAdmin: true,
                    companyHash: companyHash
                })
            } else {
                userInfo.isCompanyAdmin = true
                userInfo.companyHash = companyHash
                this.userInfo.set(fromUser, userInfo)
            }
        }

        this.companyAdmin.set(companyHash, companyAdmin)
    },
    getCompanyAdmin: function (companyHash) { //获取公司管理员列表
        var fromUser = Blockchain.transaction.from,
            ts = Blockchain.transaction.timestamp;

        this._checkAuthUserCompany(companyHash, fromUser)
        var companyAdmin = this.companyAdmin.get(companyHash)
        return companyAdmin
    },
    delCompanyAdmin: function (companyHash, adminAddress) {
        var fromUser = Blockchain.transaction.from,
            hash = Blockchain.transaction.hash,
            ts = Blockchain.transaction.timestamp;

        this._checkAuthUserCompany(companyHash, fromUser)

        var companyAdmin = this.companyAdmin.get(companyHash)
        if (!companyAdmin[adminAddress]) {
            return true
        }
        delete companyAdmin[adminAddress]

        var k = companyHash + "." + adminAddress
        this.companyAdminMap.del(k)

        this.companyAdmin.set(companyHash, companyAdmin)
        //删除员工对应管理的公司
        this.adminCompanyMap.del(companyAdmin)

        var userInfo = this.userInfo.get(adminAddress)
        if (userInfo) {
            userInfo.isCompanyAdmin = false
            delete userInfo.companyHash
            this.userInfo.set(adminAddress, userInfo)
        }
        return true
    },
    setResumeVisible: function (hash, visible) { //员工打开/隐藏某段工作经历
        var fromUser = Blockchain.transaction.from,
            resume = this.staffResume.get(hash);
        if (!resume) {
            throw new Error("404")
        }
        if (resume.nasAddress != fromUser) {
            throw new Error("403")
        }

        resume.visible = visible
        this.staffResume.set(hash, resume)
    },
    addStaffResume: function (companyHash, staff) { //添加员工简历
        var fromUser = Blockchain.transaction.from,
            hash = Blockchain.transaction.hash,
            ts = Blockchain.transaction.timestamp;

        this._checkAuthUserCompany(companyHash, fromUser)

        var staffNasAddress = staff.nasAddress;
        var staffInfo = {
            hash: hash,
            companyHash: companyHash,
            name: staff.name, // 姓名
            nasAddress: staffNasAddress, // 员工钱包地址
            joinDate: staff.joinDate, // 入职时间
            leaveDate: staff.leaveDate, // 离职时间
            jobTitle: staff.jobTitle, // 职位
            pay: staff.pay, // 工资
            joinDesc: staff.joinDesc, // 入职评价
            desc: staff.leaveDesc, // 总体评价
            created: ts,
            visible: true //某人显示该简历
        }

        this.staffResume.set(hash, staffInfo)
        // 获取员工的工作经历数量
        var staffResumeNums = this.staffResumeNums.get(staffNasAddress) * 1
        this.staffResumeIndex.set(staffNasAddress + "." + staffResumeNums, hash)
        this.staffResumeNums.set(staffNasAddress, staffResumeNums + 1)

        // 如果没有员工信息保存员工简要信息
        var userInfo = this.userInfo.get(staffNasAddress)
        if (!userInfo) {
            this.userInfo.set(staffNasAddress, {
                address: staffNasAddress,
                name: staff.name,
                created: ts
            })
        } else if (userInfo && !userInfo.name) {
            userInfo.name = staff.name
            this.userInfo.set(staffNasAddress, userInfo)
        }

        var k = companyHash + "." + staffNasAddress
        if (!this.companyStaff.get(k)) {
            var companyStaffNums = this.companyStaffNums.get(companyHash) * 1
            this.companyStaff.set(k, {
                created: ts,
                resumeHash: hash,
                index: companyStaffNums
            }) //保存这个员工是这个公司的
            this.companyStaffIndex.set(companyHash + "." + companyStaffNums, staffNasAddress)
            this.companyStaffNums.set(companyHash, companyStaffNums + 1)
        }

        this.staffNums += 1
        return {
            nums: staffResumeNums
        }
    },
    getResumeList: function (staffNasAddress) { //通过用户地址来查询工作经历
        var fromUser = Blockchain.transaction.from,
            staffResumeNums = this.staffResumeNums.get(staffNasAddress) * 1,
            result = {
                total: staffResumeNums,
                resume: []
            },
            isMySelf = fromUser == staffNasAddress;

        if (!staffResumeNums) {
            return result
        }
        for (var i = staffResumeNums - 1; i >= 0; i--) {
            var resumeHash = this.staffResumeIndex.get(staffNasAddress + "." + i)
            if (!resumeHash) {
                continue
            }
            var resume = this.staffResume.get(resumeHash)
            if (!resume) {
                continue
            }

            if (!isMySelf && resume.visible == false) {
                continue
            }
            resume.company = this.company.get(resume.companyHash)
            result.resume.push(resume)
        }
        return result
    },
    getStaffList: function (companyHash, limit, offset) { //获取员工列表，只有企业管理员才能获取
        var fromUser = Blockchain.transaction.from,
            hash = Blockchain.transaction.hash,
            ts = Blockchain.transaction.timestamp;

        this._checkAuthUserCompany(companyHash, fromUser)

        var result = {
            total: 0,
            staff: []
        }
        var total = this.companyStaffNums.get(companyHash) * 1
        if (!total) {
            return result
        }
        result.total = total
        if (offset == -1) {
            offset = total - 1
        }

        for (var i = offset; i > offset - limit; i--) {
            var staffNasAddress = this.companyStaffIndex.get(companyHash + "." + i)
            var k = companyHash + "." + staffNasAddress
            var companyStaff = this.companyStaff.get(k)
            if (companyStaff) {
                var resumeHash = companyStaff.resumeHash
                companyStaff.resumeInfo = this.staffResume.get(resumeHash)
                result.staff.push(companyStaff)
            }
        }
        return result
    },
    getCompanyList: function (limit, offset) {
        var result = {
            total: 0,
            company: []
        }
        var total = this.companyNums
        if (!total) {
            return result
        }
        result.total = total
        if (offset == -1) {
            offset = total - 1
        }

        for (var i = offset; i > offset - limit; i--) {
            var hash = this.companyIndex.get(i)
            var company = this.company.get(hash)
            if (company) {
                company.reviewed = this.reviewedCompany.get(hash)
                result.company.push(company)
            }
        }
        return result
    },
    getCompany: function (hash) { //通过公司hash获取公司信息
        var company = this.company.get(hash)
        if (company) {
            company.reviewed = this.reviewedCompany.get(hash)
        }
        return company
    },
    getCompanyByAdmin: function () { //通过公司管理员获取公司信息
        var fromUser = Blockchain.transaction.from
        var companyHash = this.adminCompanyMap.get(fromUser)
        if (!companyHash) {
            return null
        }
        var company = this.getCompany(companyHash)
        return company
    },
    resetCompanyAdmin: function (info) { //重置某个公司的管理员地址
        // 重置 company 的 fromuser 和 增加 companyAdmin {"company":"xxxxx","admin":"xxxxx"}
        var fromUser = Blockchain.transaction.from

        this._checkisAdmin(fromUser)

        var company = this.company.get(info.company)
        company.fromUser = info.admin

        this.company.set(info.company, company)
    },
    stats: function () { //查看系统状态
        var result = {
            companyNums: this.companyNums,
            reviewedCompanyNums: this.reviewedCompanyNums,
            staffNums: this.staffNums
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

module.exports = ResumeContract;
