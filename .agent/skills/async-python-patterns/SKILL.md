# Async Python Patterns Skill

## 1. Ne Zaman `async def` / `await` Kullanılır?

- **Kullanılmalı:** Veritabanı sorguları (async driver ile), harici API istekleri (aiohttp, httpx), dosya okuma/yazma (aiofiles) gibi I/O-bound (giriş/çıkış bekleyen) işlemlerde.
- **Kullanılmamalı:** Ağır matematiksel hesaplamalar, resim işleme, büyük veri döngüleri gibi CPU-bound işlemlerde. Bunlar event loop'u bloke eder. Bloklayan kodlar için `asyncio.to_thread` veya `ProcessPoolExecutor` kullanılmalıdır.

## 2. Püf Noktaları ve Tuzaklar

- **Synchronous Call Tuzağı:** `async def` ile tanımlanmış bir endpoint içinde `time.sleep()`, `requests.get()`, veya senkron SQLAlchemy sorgusu kullanmak **tüm web sunucusunun (FastAPI vs) asılı kalmasına (block)** neden olur. Senkron kodlar ya `def` ile tanımlanan endpointlerde ya da thread pool içinde çalıştırılmalıdır.
- **Event Loop Nesting:** Bir async fonksiyonun içinden tekrar `asyncio.run()` çağırmak `RuntimeError: asyncio.run() cannot be called from a running event loop` hatası verir. Uvicorn/FastAPI zaten bir loop üzerinde çalışır.

## 3. `asyncio.gather()` vs `asyncio.create_task()`

- **create_task():** Bir coroutine'i hemen çalışmaya başlatmak (planlamak) için kullanılır. Genellikle background (arkaplan) işlemleri için veya bir döngüde biriktirip sonra beklemek için idealdir. (Referansı saklamak zorunludur: `background_tasks.add(task)`)
- **gather():** Elinizdeki birden fazla task veya coroutine'in bitmesini toplu olarak beklemek istediğinizde kullanılır. Hepsini paralel başlatır ve sonuçlarını sırasıyla bir liste olarak döner. `return_exceptions=True` parametresi ile içlerinden biri patlasa bile diğerlerini iptal ettirmeden devam edebilirsiniz.

## 4. Timeout ve İptal (Cancellation)

- `asyncio.wait_for(task, timeout=5.0)` ile dış API servislerine bağlanırken uzun süre takılı kalmayı önleyin. Süre dolduğunda `TimeoutError` fırlatılır ve coroutine iptal edilir. Python 3.11+ için daha modern olan `asyncio.timeout(5.0)` context manager'ını kullanın.
- Bir görevin iptal edilmesi durumunda `asyncio.CancelledError` hatası fırlar. Finally bloğunda I/O veya kaynak cleanup yaparken iptali yutmayın.

## 5. İleri Düzey Performans (uvloop)

Python'un varsayılan `asyncio` event loop'u yerine, Cython ile yazılmış ve Node.js'ten daha hızlı olan `uvloop` kullanmak FastAPI/Uvicorn projelerinde standard performansı 2 katına çıkarabilir. `uvicorn app:main --loop uvloop` şeklinde veya `asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())` ile ayarlanmalıdır.
