<div align="center">
	<img src="./public/favicon.svg" style="width: 160px;"/>
	<h1>Library-System-Manager</h1>
</div>

[![license](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE) ![](https://img.shields.io/github/stars/honghuangdc/soybean-admin) ![](https://img.shields.io/github/forks/honghuangdc/soybean-admin)

## 简介

[Library-System-Manager(ZTBU)](https://github.com/HollyCci/Library-System-Mnanager) 是一个基于 [SoybeanAdmin](https://github.com/honghuangdc/soybean-admin) 开发的高校图书馆管理及可视化平台。平台以郑州工商学院的高校图书馆设施实际应用为背景，通过设计与实现图书馆用户行为数据可视化平台，加强对用户行为数据的集中管理和分析，并引入先进的数据可视化工具，可以使图书馆管理者能够更全面、深入地理解用户行为，以提高图书馆的人性化和个性化服务水平。同时将整合先进技术，在图书馆智能管理系统的加持下，能够更好地推动图书馆向智能化管理方向迈进。

## 前端特性

- **最新流行技术栈**：使用 Vue3/Vite 等前端前沿技术开发, 使用高效率的 npm 包管理器 pnpm
- **TypeScript**: 应用程序级 JavaScript 的语言
- **主题**：丰富可配置的主题、暗黑模式，基于原子 css 框架 - UnoCss 的动态主题颜色
- **代码规范**：丰富的规范插件及极高的代码规范
- **文件路由系统**：基于文件的路由系统，根据页面文件自动生成路由声明、路由导入和路由模块
- **权限路由**：提供前端静态和后端动态两种路由模式，基于 mock 的动态路由能快速实现后端动态路由
- **请求函数**：基于 axios 的完善的请求函数封装，提供 Promise 和 hooks 两种请求函数，加入请求结果数据转换的适配器

## 后端特性

- **架构**：采用 Spring Boot 多模块架构、MySQL + MyBatis Plus、Redis + Redisson
- **消息队列：**可使用 Event、Redis、RabbitMQ、Kafka、RocketMQ 等
- **权限认证：**使用 Spring Security & Token & Redis，支持多终端、多种用户的认证系统，支持 SSO 单点登录
- **权限控制：**支持加载动态权限菜单，按钮级别权限控制，Redis 缓存提升性能
- **SaaS 多租户：**支持 SaaS 多租户，可自定义每个租户的权限，提供透明化的多租户底层封装
- **实时通信：**采用 Spring WebSocket 实现，内置 Token 身份校验，支持 WebSocket 集群
- **第三方：**集成微信小程序、微信公众号、企业微信、钉钉等三方登陆，集成支付宝、微信等支付与退款

## 项目架构图

![技术架构图.png](https://s2.loli.net/2024/01/18/5jPM8sNJtFcBEfl.png)

## 预览

- [Library-System 预览地址](http://t.lihaha.cn/)
- [作者主页](http://wocc.site/)

## 文档

- [ ] 文档网站开发

## 项目示例图

![分析页.png](https://s2.loli.net/2024/01/18/HF7EXjqTweKz1ol.png)

![用户管理.png](https://s2.loli.net/2024/01/18/TCnWFYSbHuaKjqL.png)

![菜单管理.png](https://s2.loli.net/2024/01/18/CjokqRw87bLhiYW.png)

![班级管理.png](https://s2.loli.net/2024/01/18/m41JdkILac2XROw.png)

![菜单权限.png](https://s2.loli.net/2024/01/18/5uOhPlyjYtXRzCL.png)

![角色管理.png](https://s2.loli.net/2024/01/18/ZF9lmW5NwhBLnUq.png)

![数据权限.png](https://s2.loli.net/2024/01/18/ME4kVHv3D7F1IPY.png)

![租户管理.png](https://s2.loli.net/2024/01/18/hUF3fzsMHI6qGo1.png)

![租户套餐.png](https://s2.loli.net/2024/01/18/zyZLfA1s56g2nwN.png)

![图书管理.png](https://s2.loli.net/2024/01/18/oCAwH3b8Pmc49fG.png)

![图书详情.png](https://s2.loli.net/2024/01/18/6exCGsUKYk21hSf.png)

![书库管理.png](https://s2.loli.net/2024/01/18/1MPRiVfFaB5oEIr.png)

![我的借阅.png](https://s2.loli.net/2024/01/18/NRHZ6pWM4Gtmb97.png)

![借阅详情.png](https://s2.loli.net/2024/01/18/hLNqTuo578OxCPD.png)

## 安装使用

- 环境配置
  **本地环境需要安装 pnpm 7.x 、Node.js 14.18+ 和 Git**

- 克隆代码

- 安装依赖

```bash
pnpm i
```

- 运行

```bash
pnpm dev
```

- 打包

```bash
pnpm build
```

## Docker 部署

- Docker 部署 Soybean

```bash
docker run --name soybean -p 80:80 -d soybeanjs/soybean-admin:v0.9.6
```

- 访问 Library-System-Manager

打开本地浏览器访问`http://localhost:8847`

## Git 贡献提交规范

项目已经内置 Angular 提交规范，直接执行 commit 命令即可生成符合 Angular 提交规范的 commit。

项目已用 simple-git-hooks 代替了 husky, 旧版本用了 husky，执行 pnpm soy init-git-hooks 进行初始化配置
