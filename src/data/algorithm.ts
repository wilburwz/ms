import type { KnowledgePoint } from '../types'

export const algorithmData: KnowledgePoint[] = [
  {
    id: "alg-01",
    title: "常见排序算法对比",
    category: "algorithm",
    difficulty: 2,
    question: "请对比常见排序算法的时间复杂度、空间复杂度和稳定性。",
    answer: "| 算法 | 平均 | 最坏 | 最好 | 空间 | 稳定 |\n|------|------|------|------|------|------|\n| 冒泡 | O(n²) | O(n²) | O(n) | O(1) | ✅ |\n| 选择 | O(n²) | O(n²) | O(n²) | O(1) | ❌ |\n| 插入 | O(n²) | O(n²) | O(n) | O(1) | ✅ |\n| 归并 | O(nlogn) | O(nlogn) | O(nlogn) | O(n) | ✅ |\n| 快排 | O(nlogn) | O(n²) | O(nlogn) | O(logn) | ❌ |\n| 堆排 | O(nlogn) | O(nlogn) | O(nlogn) | O(1) | ❌ |\n\n面试重点：\n- 快排：最常考，理解分区思想和优化（三数取中、小数组插排）\n- 归并：稳定排序，适合链表\n- 堆排：原地排序，适合 TopK 问题",
    codeExample: "// 快速排序\nfunction quickSort(arr: number[]): number[] {\n  if (arr.length <= 1) return arr\n  const pivot = arr[Math.floor(arr.length / 2)]\n  const left = arr.filter(x => x < pivot)\n  const mid = arr.filter(x => x === pivot)\n  const right = arr.filter(x => x > pivot)\n  return [...quickSort(left), ...mid, ...quickSort(right)]\n}",
    tags: ["算法", "排序", "快排", "归并"],
  },
  {
    id: "alg-02",
    title: "二分查找与变体",
    category: "algorithm",
    difficulty: 1,
    question: "二分查找的实现和常见变体？",
    answer: "基本条件：有序数组\n\n基本模板：\n- left = 0, right = len - 1\n- mid = left + ((right - left) >> 1)（防溢出）\n- 每次缩小一半范围\n\n常见变体：\n1. 查找第一个等于 target 的位置\n2. 查找最后一个等于 target 的位置\n3. 查找第一个大于等于 target 的位置\n4. 查找最后一个小于等于 target 的位置\n\n注意：\n- 循环条件 left <= right\n- mid 计算避免溢出\n- 更新边界注意 +1/-1",
    codeExample: "function binarySearch(nums: number[], target: number): number {\n  let left = 0, right = nums.length - 1\n  while (left <= right) {\n    const mid = left + ((right - left) >> 1)\n    if (nums[mid] === target) return mid\n    if (nums[mid] < target) left = mid + 1\n    else right = mid - 1\n  }\n  return -1\n}",
    tags: ["算法", "二分查找", "搜索"],
  },
  {
    id: "alg-03",
    title: "DFS 与 BFS",
    category: "algorithm",
    difficulty: 2,
    question: "深度优先搜索和广度优先搜索的实现与适用场景？",
    answer: "DFS (深度优先)：\n- 用栈（递归调用栈或显式栈）\n- 沿一条路走到底再回溯\n- 适合：路径搜索、排列组合、树的前中后序遍历\n\nBFS (广度优先)：\n- 用队列\n- 逐层遍历\n- 适合：最短路径、层序遍历、连通性判断\n\n时间复杂度：都是 O(V + E)\n空间复杂度：\n- DFS: O(h) h=深度\n- BFS: O(w) w=最大宽度\n\n模板：\n- DFS: 递归 or stack\n- BFS: queue + visited set",
    codeExample: "// DFS - 递归\nfunction dfs(node: TreeNode) {\n  if (!node) return\n  console.log(node.val)\n  dfs(node.left)\n  dfs(node.right)\n}\n\n// BFS - 队列\nfunction bfs(root: TreeNode) {\n  const queue = [root]\n  while (queue.length) {\n    const node = queue.shift()!\n    console.log(node.val)\n    if (node.left) queue.push(node.left)\n    if (node.right) queue.push(node.right)\n  }\n}",
    tags: ["算法", "DFS", "BFS", "搜索"],
  },
  {
    id: "alg-04",
    title: "动态规划解题思路",
    category: "algorithm",
    difficulty: 3,
    question: "动态规划的解题步骤？常见题型？",
    answer: "解题步骤：\n1. 定义状态：dp[i] 表示什么\n2. 状态转移方程：dp[i] = f(dp[i-1], ...)\n3. 初始条件：dp[0] = ?\n4. 遍历顺序：从前往后 or 从后往前\n5. 返回结果：dp[n]\n\n常见题型：\n1. 线性 DP：爬楼梯、打家劫舍、最长递增子序列\n2. 背包 DP：0-1 背包、完全背包\n3. 区间 DP：矩阵链乘法、回文子串\n4. 树形 DP：树上的最大路径和\n5. 状态压缩 DP：旅行商问题\n\n优化：\n- 滚动数组压缩空间\n- 记忆化搜索（递归 + 缓存）\n- 状态压缩",
    codeExample: "// 爬楼梯\ndp[i] = dp[i-1] + dp[i-2]\nfunction climbStairs(n: number): number {\n  if (n <= 2) return n\n  let prev2 = 1, prev1 = 2\n  for (let i = 3; i <= n; i++) {\n    const curr = prev1 + prev2\n    prev2 = prev1\n    prev1 = curr\n  }\n  return prev1\n}\n\n// 最长递增子序列\ndp[i] = max(dp[j] + 1) for j < i and nums[j] < nums[i]",
    tags: ["算法", "动态规划", "DP", "状态转移"],
  },
  {
    id: "alg-05",
    title: "链表常见操作",
    category: "algorithm",
    difficulty: 2,
    question: "链表的常见面试题有哪些？解题技巧？",
    answer: "常见题型：\n1. 反转链表（迭代/递归）\n2. 合并两个有序链表\n3. 环的检测（快慢指针）\n4. 链表中间节点（快慢指针）\n5. 删除倒数第 N 个节点（双指针）\n6. 相交链表（双指针交换走）\n\n解题技巧：\n- 虚拟头节点：简化边界处理\n- 快慢指针：找中间、检测环\n- 双指针：删除、合并\n- 递归：反转、合并\n\n注意：\n- 画图理清指针变化\n- 注意空指针处理\n- 先连后断，避免丢失引用",
    codeExample: "// 反转链表\nfunction reverseList(head: ListNode): ListNode {\n  let prev = null, curr = head\n  while (curr) {\n    const next = curr.next\n    curr.next = prev\n    prev = curr\n    curr = next\n  }\n  return prev\n}\n\n// 环检测\nfunction hasCycle(head: ListNode): boolean {\n  let slow = head, fast = head\n  while (fast?.next) {\n    slow = slow.next\n    fast = fast.next.next\n    if (slow === fast) return true\n  }\n  return false\n}",
    tags: ["算法", "链表", "快慢指针", "双指针"],
  }
]
