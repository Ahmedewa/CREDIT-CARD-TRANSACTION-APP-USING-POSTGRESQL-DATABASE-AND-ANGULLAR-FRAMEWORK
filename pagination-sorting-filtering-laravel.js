                  LARAVEL BEST PRACTICES

### **1. Pagination, Sorting, and Filtering for List Endpoints**

#### **Laravel Best Practices**
- Use **Eloquent** for database queries.
- Use `query scopes` for reusable filtering logic.
- Use `pagination` with `search` and `sorting` parameters in the query string.

---

#### **Controller Implementation**

** PodcastController**
```php
namespace App\Http\Controllers;

use App\Models\Podcast;
use Illuminate\Http\Request;

class PodcastController extends Controller
{
    public function index(Request $request)
    {
        // Pagination
        $perPage = $request->query('per_page', 10); // Default to 10 items per page

        // Sorting
        $sortBy = $request->query('sort_by', 'created_at'); // Default column: created_at
        $sortOrder = $request->query('sort_order', 'desc'); // Default order: descending

        // Filtering
        $categoryId = $request->query('category_id');
        $searchQuery = $request->query('search');

        $podcasts = Podcast::query()
            ->when($categoryId, function ($query, $categoryId) {
                return $query->where('category_id', $categoryId);
            })
            ->when($searchQuery, function ($query, $searchQuery) {
                return $query->where('title', 'like', "%{$searchQuery}%");
            })
            ->orderBy($sortBy, $sortOrder)
            ->paginate($perPage);

        return response()->json($podcasts);
    }
}
```

---

#### **Route Definition**
Add this to `routes/api.php`:
```php
Route::get('/podcasts', [PodcastController::class, 'index']);
```

---

#### ** Request**
```http
GET /api/podcasts?per_page=5&sort_by=title&sort_order=asc&category_id=2&search=tech
```

---

#### **Query Scopes for Reusability**
Define query scopes for filtering in the `Podcast` model:
```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Podcast extends Model
{
    public function scopeFilterByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeSearch($query, $searchQuery)
    {
        return $query->where('title', 'like', "%{$searchQuery}%");
    }
}
```

Refactor the controller:
```php
$podcasts = Podcast::query()
    ->filterByCategory($categoryId)
    ->search($searchQuery)
    ->orderBy($sortBy, $sortOrder)
    ->paginate($perPage);
```

---

### **2. AuthController Login Method**

#### **Login Method Implementation**
```php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validate input
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        // Attempt login
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('API Token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'user' => $user,
            ], 200);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }
}
```

---

#### **Route Definition**
Add this to `routes/api.php`:
```php
Route::post('/login', [AuthController::class, 'login']);
```

---

#### **Logout Method**
```php
public function logout(Request $request)
{
    $request->user()->currentAccessToken()->delete();

    return response()->json(['message' => 'Logged out successfully'], 200);
}
```

---

### **3. RabbitMQ: Setting Up Queues**

#### **3a) Install RabbitMQ**
1. Install RabbitMQ:
   ```bash
   sudo apt update
   sudo apt install rabbitmq-server
   ```

2. Enable and start RabbitMQ:
   ```bash
   sudo systemctl enable rabbitmq-server
   sudo systemctl start rabbitmq-server
   ```

3. Verify RabbitMQ is running:
   ```bash
   sudo rabbitmqctl status
   ```

---

#### **3b) Laravel Queue Configuration**

1. Install Laravel Queue Package:
   ```bash
   composer require predis/predis
   ```

2. Update `.env` for RabbitMQ:
   ```env
   QUEUE_CONNECTION=redis
   ```

3. Set up a queue worker:
   ```bash
   php artisan queue:work
   ```

4. Job:
   ```php
   namespace App\Jobs;

   use Illuminate\Bus\Queueable;
   use Illuminate\Contracts\Queue\ShouldQueue;
   use Illuminate\Foundation\Bus\Dispatchable;
   use Illuminate\Queue\InteractsWithQueue;
   use Illuminate\Queue\SerializesModels;

   class ProcessPodcastUpload implements ShouldQueue
   {
       use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

       public function __construct(public $podcastId) {}

       public function handle()
       {
           // Logic to process podcast upload
       }
   }
   ```

5. Dispatch a Job:
   ```php
   ProcessPodcastUpload::dispatch($podcastId);
   ```

---

### **4. Nginx Configuration**

#### **4a) Frontend (Static Hosting)**
1. Add a site configuration:
   ```bash
   sudo nano /etc/nginx/sites-available/frontend
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       root /var/www/frontend;
       index index.html;

       location / {
           try_files $uri /index.html;
       }
   }
   ```

2. Enable the configuration:
   ```bash
   sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

#### **4b) Reverse Proxy (Backend)**
1. Add a configuration for the backend:
   ```bash
   sudo nano /etc/nginx/sites-available/backend
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

2. Enable the configuration:
   ```bash
   sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

### **5. API Versioning**

#### **5a) Add Version Prefix**
Update `routes/api.php`:
```php
Route::prefix('v1')->group(function () {
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('podcasts', PodcastController::class);
    Route::apiResource('episodes', EpisodeController::class);
});
```

---

### **6. Additional Features**

#### **6a) Caching**
Use Laravel's built-in caching:
```php
use Illuminate\Support\Facades\Cache;

$podcasts = Cache::remember('podcasts', now()->addHours(2), function () {
    return Podcast::all();
});
```

---

#### **6b) Monitoring with Grafana and Prometheus**
1. Install Prometheus and Grafana:
   ```bash
   sudo apt install prometheus grafana
   ```

2. Export Laravel metrics with Prometheus:
   ```bash
   composer require jimdo/prometheus_client_php
   ```

---

### **7. Resources and Best Practices**

#### **7a) Resources**
- **Laravel Documentation**: [https://laravel.com/docs](https://laravel.com/docs)
- **RabbitMQ Docs**: [https://www.rabbitmq.com/](https://www.rabbitmq.com/)
- **Nginx Docs**: [https://nginx.org/](https://nginx.org/)

#### **7b) Best Practices**
1. **Follow RESTful Standards**: Use proper HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).
2. **Secure APIs**: Use `Laravel Sanctum` for token-based authentication.
3. **Optimize Queries**: Use eager loading to avoid N+1 query issues.
4. **Write Tests**:
   - Unit tests for models.
   - Feature tests for endpoints.
5. **Use CI/CD**: Automate deployments with GitHub Actions or GitLab CI.

