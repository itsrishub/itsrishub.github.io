---
layout: post
category: algorithms 
---

Raft is a **consensus algorithm** designed to help a group of machines agree on the same sequence of actions (a **log**) even if some machines fail. It’s widely used in systems like **distributed databases**, **key-value stores**, and **Raft storage**.

**Step-by-step mental model** of how Raft works.

---

## 1 Core Idea (One-Line)

> Raft keeps multiple servers in sync by **electing one leader**, and **only the leader decides what gets written**.

---

## 2 Roles in Raft

Every node is always in **one** of these roles:

| Role          | What it does                                    |
| ------------- | ----------------------------------------------- |
| **Leader**    | Handles all client requests and log replication |
| **Follower**  | Passive, just listens and applies updates       |
| **Candidate** | Tries to become leader during elections         |

At any time, **there is at most one leader**.

---

## 3 Leader Election (How a Leader Is Chosen)

![Image](https://eli.thegreenplace.net/images/2020/raft-highlevel-state-machine.png)

![Image](https://miro.medium.com/v2/resize%3Afit%3A1400/0%2AQxpldrGD9Ft3xBsN)

### Step-by-step

1. All nodes start as **followers**
2. If a follower doesn’t hear from a leader (heartbeat timeout):

   * It becomes a **candidate**
3. Candidate:

   * Increments its **term**
   * Asks others for votes
4. If it gets **majority votes**:

   * It becomes the **leader**
5. If not:

   * Election restarts with randomized timeouts

**Majority is mandatory** → prevents split-brain.

---

## 4 Log Replication (How Data Is Safely Written)

![Image](/images/raft.png)

![Image](https://miro.medium.com/v2/resize%3Afit%3A1400/1%2AqC8d8hu2LjIY_sH6vwODdQ.png)

### Writing data works like this:

1. Client sends request → **Leader**
2. Leader:

   * Appends entry to its log
   * Sends **AppendEntries RPC** to followers
3. Followers:

   * Write entry to their logs
   * Send ACK back
4. Once **majority ACKs**:

   * Leader **commits** the entry
   * Followers apply it to their state machine

Only committed entries are considered durable.

---

## 5 Terms (Raft’s Logical Clock)

Raft uses **terms** to maintain order.

| Term             | Meaning                 |
| ---------------- | ----------------------- |
| Integer counter  | Increases monotonically |
| New election     | New term                |
| Higher term wins | Old leaders step down   |

If a node sees a **higher term**, it immediately becomes a follower.

---

## 6 Safety Guarantees (Why Raft Is Reliable)

Raft guarantees:

### Leader Completeness

* If an entry is committed, **all future leaders will have it**

### Log Matching

* If two logs have same index + term → logs before it are identical

### No Split Brain

* Only one leader per term (majority rule)

---

## 7 Failure Scenarios (What Happens If…)

### Leader crashes

* Followers stop receiving heartbeats
* New election starts
* New leader takes over

### Follower crashes

* Leader continues (as long as majority exists)
* Follower catches up later

### Network partition

* Side with **majority** continues
* Minority side becomes read-only

---

## 8 Why Raft Is Easier Than Paxos

Raft was designed to be **understandable**, unlike Paxos.

| Paxos                | Raft              |
| -------------------- | ----------------- |
| Hard to reason about | Easy mental model |
| Abstract             | Practical roles   |
| Leader implicit      | Leader explicit   |

---

## 9 One Diagram Mental Model

```
Client
  |
  v
Leader  --->  Follower
  |            Follower
  |            Follower
  |
(commit after majority)
```

---

## TL;DR

* Raft = **Leader-based consensus**
* Leader is elected by **majority**
* All writes go through leader
* Logs are replicated and committed safely
* Designed to be **simple and predictable**
