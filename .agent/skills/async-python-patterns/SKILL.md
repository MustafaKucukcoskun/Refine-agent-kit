# Async Python Patterns Skill

## 1. When to Use `async def` / `await`?

- **Should use:** For I/O-bound operations such as database queries (with async driver), external API requests (aiohttp, httpx), file read/write (aiofiles).
- **Should NOT use:** For CPU-bound operations such as heavy mathematical computations, image processing, large data loops. These block the event loop. Use `asyncio.to_thread` or `ProcessPoolExecutor` for blocking code.

## 2. Tips and Pitfalls

- **Synchronous Call Trap:** Using `time.sleep()`, `requests.get()`, or synchronous SQLAlchemy queries inside an `async def` endpoint will **cause the entire web server (FastAPI etc.) to hang (block).** Synchronous code should run either in endpoints defined with `def` or inside a thread pool.
- **Event Loop Nesting:** Calling `asyncio.run()` from inside an async function raises `RuntimeError: asyncio.run() cannot be called from a running event loop`. Uvicorn/FastAPI already runs on a loop.

## 3. `asyncio.gather()` vs `asyncio.create_task()`

- **create_task():** Used to immediately start (schedule) a coroutine. Ideal for background operations or for accumulating tasks in a loop to await later. (Storing the reference is mandatory: `background_tasks.add(task)`)
- **gather():** Used when you want to wait for multiple tasks or coroutines to complete collectively. Starts all in parallel and returns results as a list in order. With `return_exceptions=True`, even if one fails, others continue without being cancelled.

## 4. Timeout and Cancellation

- Use `asyncio.wait_for(task, timeout=5.0)` to prevent hanging when connecting to external API services. When time expires, `TimeoutError` is raised and the coroutine is cancelled. For Python 3.11+, use the more modern `asyncio.timeout(5.0)` context manager.
- When a task is cancelled, `asyncio.CancelledError` is raised. Do not swallow the cancellation when performing I/O or resource cleanup in a finally block.

## 5. Advanced Performance (uvloop)

Using `uvloop`, written in Cython and faster than Node.js, instead of Python's default `asyncio` event loop can double standard performance in FastAPI/Uvicorn projects. Set it with `uvicorn app:main --loop uvloop` or `asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())`.
