import axios from 'axios';
import { apiUrl } from '@/api/api';

/**
 * 表示不同时间段的统计数据
 */
interface Periods {
  /** 时间段内失败的任务数 */
  failedJobs: number;
  /** 时间段内最近处理的任务数 */
  recentJobs: number;
}

/**
 * 表示不同队列类型的等待时间
 */
interface Wait {
  /** Telegram发送队列的等待时间 */
  'redis:send_telegram': number;
}

/**
 * 表示队列的整体统计信息
 */
export interface QueueStats {
  /** 失败任务总数 */
  failedJobs: number;
  /** 每分钟处理的任务数 */
  jobsPerMinute: number;
  /** 处于暂停状态的主节点数量 */
  pausedMasters: number;
  /** 不同时间段的统计数据 */
  periods: Periods;
  /** 活跃进程数量 */
  processes: number;
  /** 运行时间最长的队列 */
  queueWithMaxRuntime: string;
  /** 吞吐量最大的队列 */
  queueWithMaxThroughput: string;
  /** 最近处理的任务数 */
  recentJobs: number;
  /** 队列系统运行状态 */
  status: boolean;
  /** 不同队列类型的等待时间 */
  wait: Wait;
}

/**
 * 表示队列的工作负载信息
 */
export interface QueueWorkload {
  /** 队列名称 */
  name: string;
  /** 队列中的任务数量 */
  length: number;
  /** 队列中任务的等待时间 */
  wait: number;
  /** 处理此队列的进程数量 */
  processes: string;
  /** 队列分区信息 */
  split_queues: string;
}

/**
 * 获取队列的整体统计信息
 * @returns 返回包含QueueStats数据的Promise
 */
export const GetQueueStats = () => {
  return axios.get<QueueStats>(apiUrl.getQueueStats);
};

/**
 * 获取所有队列的工作负载信息
 * @returns 返回包含QueueWorkload数组的Promise
 */
export const GetQueueWorkload = () => {
  return axios.get<QueueWorkload[]>(apiUrl.getQueueWorkload);
};