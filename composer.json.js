
              COMPOSER-JSON-FILE

---

## **1. `requirements.txt` File (Dependencies)**

Laravel uses **Composer** for dependency management, so instead of a `requirements.
txt` file (used in Python projects), Laravel has a `composer.json` file to list 
  our project dependencies. Below is a detailed explanation of the required 
  dependencies for our project.

---

### **1a) `composer.json` File**
A `composer.json` file with dependencies tailored to our project:

```json
{
    "require": {
        "php": "^8.0",
        "laravel/framework": "^10.0",
        "laravel/sanctum": "^3.2",              // For API authentication
        "laravel/telescope": "^4.0",           // For debugging and monitoring
        "swagger-lume": "^8.0",                // For API documentation
        "guzzlehttp/guzzle": "^7.0",           // For HTTP requests
        "laravel/horizon": "^5.14",            // For queue monitoring
        "predis/predis": "^2.0",               // For Redis queue and caching
        "phpunit/phpunit": "^10.0",            // For testing
        "mockery/mockery": "^1.6",             // For testing mocks
        "barryvdh/laravel-debugbar": "^3.8",   // For debugging
        "spatie/laravel-query-builder": "^5.0" // For filtering, sorting, and pagination
    }
}
```

---

### **1b) Install Dependencies**
Run the following command to install dependencies:
```bash
composer install
```

---

### **1c) `package.json` for Frontend Dependencies**
If your project uses **frontend assets**, include these dependencies:
```json
{
    "devDependencies": {
        "axios": "^1.0",          // For API requests
        "laravel-mix": "^6.0",    // For asset compilation
        "tailwindcss": "^3.3",    // For styling
        "postcss": "^8.0",
        "autoprefixer": "^10.0"
    }
}
```

Install with:
```bash
npm install
```

---

## **2. Idempotency in API Design**

### **2a) What is Idempotency?**
- **Definition**: Idempotency ensures that making the same API request multiple times results in the same outcome (e.g., creating a payment or booking).
- **Use Case**: Prevent duplicate actions in POST, PUT, or PATCH requests.

---

### **2b) Implementation in Laravel**

#### **1. Add an `idempotency_keys` Table**
Create a migration to store idempotency keys:
```bash
php artisan make:migration create_idempotency_keys_table
```

Migration file:
```php
Schema::create('idempotency_keys', function (Blueprint $table) {
    $table->id();
    $table->string('key')->unique();
    $table->json('response')->nullable();
    $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
});
```

Run the migration:
```bash
php artisan migrate
```

---

#### **2. Middleware for Idempotency**

Create a middleware to handle idempotency:
```bash
php artisan make:middleware IdempotencyMiddleware
```

Middleware code:
```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Cache;

class IdempotencyMiddleware
{
    public function handle($request, Closure $next)
    {
        $idempotencyKey = $request->header('Idempotency-Key');

        if (!$idempotencyKey) {
            return response()->json(['error' => 'Idempotency-Key header is required'], 400);
        }

        // Check if the key already exists
        $cachedResponse = Cache::get($idempotencyKey);

        if ($cachedResponse) {
            return response()->json(json_decode($cachedResponse, true));
        }

        // Process the request
        $response = $next($request);

        // Cache the response
        Cache::put($idempotencyKey, $response->getContent(), now()->addMinutes(10));

        return $response;
    }
}
```

---

#### **3. Apply Middleware to Specific Routes**
In `app/Http/Kernel.php`, register the middleware:
```php
protected $routeMiddleware = [
    'idempotency' => \App\Http\Middleware\IdempotencyMiddleware::class,
];
```

Apply to routes in `routes/api.php`:
```php
Route::post('/create-podcast', [PodcastController::class, 'store'])->middleware('idempotency');
```

---

#### **4.  Usage**
When making a POST request, send an `Idempotency-Key` header:
```http
POST /api/create-podcast
Idempotency-Key: 12345abcde
Content-Type: application/json

{
    "title": "Tech Podcast",
    "description": "A podcast about tech trends."
}
```

---

## **3. Implementation of Code Coverage**

### **3a) What is Code Coverage?**
- **Definition**: Code coverage measures how much of your application’s code is covered by automated tests.
- **Tools**: Laravel uses PHPUnit and integrates with tools like **Xdebug** or **Coverage.py**.

---

### **3b) Install PHPUnit**
PHPUnit is already included in Laravel projects. Verify installation:
```bash
vendor/bin/phpunit --version
```

---

### **3c) Enable Code Coverage with Xdebug**

1. **Install Xdebug**
   For Ubuntu:
   ```bash
   sudo apt-get install php-xdebug
   ```

2. **Configure Xdebug**
   Add the following to your `php.ini` file:
   ```ini
   [xdebug]
   zend_extension=xdebug.so
   xdebug.mode=coverage
   xdebug.start_with_request=yes
   ```

3. **Restart PHP**
   ```bash
   sudo systemctl restart php8.0-fpm
   ```

---

### **3d) Run Tests with Coverage**
Run PHPUnit with coverage:
```bash
vendor/bin/phpunit --coverage-html coverage/
```

This generates an HTML report in the `coverage/` directory.

---

### **3e)Test Case with Coverage**

#### **Test Case for Podcast API**
Create a test:
```bash
php artisan make:test PodcastTest
```

Test file:
```php
namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Podcast;

class PodcastTest extends TestCase
{
    public function testCreatePodcast()
    {
        $response = $this->postJson('/api/create-podcast', [
            'title' => 'Tech Trends',
            'description' => 'A podcast about technology.',
            'category_id' => 1,
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'id', 'title', 'description', 'category_id'
                 ]);
    }
}
```

---

#### **Run Tests with Coverage**
```bash
vendor/bin/phpunit --coverage-html coverage/
```

Open the `coverage/index.html` file in a browser to view results.

---

### **3f) Automate Code Coverage in CI/CD**
Integrate with GitHub Actions:
```yaml
name: Run Tests

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: 8.0
        extensions: xdebug

    - name: Install Dependencies
      run: composer install

    - name: Run Tests with Coverage
      run: vendor/bin/phpunit --coverage-text
```

---

## **Best Practices**

### **1. Dependencies**
- Use version constraints (`^` or `~`) in `composer.json` to ensure compatibility.
- Regularly update dependencies with:
  ```bash
  composer update
  ```

---

### **2. Idempotency**
- Use a short expiration time (e.g., 10 minutes) for idempotency keys to avoid bloated storage.
- Store keys in **Redis** for fast lookup.

---

### **3. Code Coverage**
- Aim for **80-90% coverage**, focusing on critical business logic.
- Use tools like **SonarQube** or **Codecov** for advanced code analysis.

---

### **Resources**
- **Laravel Docs**: [https://laravel.com/docs](https://laravel.com/docs)
- **PHPUnit Docs**: [https://phpunit.de/documentation.html](https://phpunit.de/documentation.html)
- **Xdebug Docs**: [https://xdebug.org/docs](https://xdebug.org/docs)
- **Idempotency Best Practices**: [Stripe Idempotency Guide](https://stripe.com/docs/api/idempotent_requests)

