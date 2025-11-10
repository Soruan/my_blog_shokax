## 介绍

个人博客源码，使用hexo框架和shokax主题。本地编译并推送到远程仓库后，触发GitHub aciton，将编译出的public文件夹推送到GitHub page仓库，以此来更新博客。

## 使用
### 一、部署

按照node.js和npm、pnpm包管理器

```bash
◎ node --version                                                        
v22.20.0
(base) 
                                                                                
◎ npm --version                                                        
10.9.3
(base) 
                                                                                
◎ pnpm --version                                                   
10.18.1
                                                                               
```

按照依赖

```bash
# 进入仓库后，执行pnpm install
cd ~/my_blog_shokax

pnpm install
```

### 二、HEXO基础操作

我没有选择将hexo全局按照，而是每次都用pnpm来调用hexo

```bash
# 编译生成静态网页
pnpm dlx hexo g

# 本地预览网页内容
pnpm dlx hexo s

# 清理
pnpm dlx heox clean
```

### 三、博客管理

图片管理：themes/shokax/_images.yml