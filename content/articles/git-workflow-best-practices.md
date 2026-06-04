---
id: git-workflow-best-practices
title: Git 工作流最佳实践
date: 2026-03-10
category: 开发工具
readTime: 5 分钟
tags:
  - Git
  - 团队协作
  - 版本控制
---

# Git 工作流最佳实践

## 分支策略

### Git Flow

这是一个经典的分支模型：

- `main`：主分支，存放稳定代码
- `develop`：开发分支，集成所有功能
- `feature/*`：功能分支，开发新功能
- `release/*`：发布分支，准备发布
- `hotfix/*`：紧急修复分支

### Trunk Based Development

适合持续集成的简单模型：

- `main`：唯一的长期分支
- 功能通过短生命周期的特性分支开发

## 提交规范

### 使用约定式提交

格式：`<type>(<scope>): <description>`

常见类型：
- `feat`：新功能
- `fix`：修复 bug
- `docs`：文档更新
- `style`：代码格式
- `refactor`：重构
- `test`：测试
- `chore`：构建/工具更新

示例：`feat(auth): add login with Google`

### 保持提交粒度适中

- 每个提交应该是一个独立的逻辑单元
- 避免超大提交
- 避免过于琐碎的提交

## 代码审查

### PR 审查流程

1. 创建 PR 时提供清晰的描述
2. 添加相关的测试
3. 至少需要一个 reviewer 批准
4. 使用 CI/CD 自动检查

### 审查要点

- 代码正确性
- 代码质量
- 性能考虑
- 安全性
- 可维护性

## 总结

选择适合团队的工作流，并坚持执行，可以显著提高团队的协作效率。