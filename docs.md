# API Documentation

## Authentication (`/auth`)

### `POST /auth/login`

Logs in a user.

**Request Body:** `UserLoginDto`

```json
{
  "login": "string (required)",
  "password": "string (required)"
}
```

**Responses:**

*   **200 OK**: Login successful.
    *   Body: `{ "accessToken": "string", "refreshToken": "string" }` (Example)

---

### `POST /auth/register`

Registers a new user.

**Request Body:** `UserRegisterDto`

```json
{
  "username": "string (optional)",
  "email": "string (required, email format)",
  "password": "string (required, min length 6)",
  "role": "string (optional, enum: ADMIN, USER)"
}
```

**Responses:**

*   **201 Created / 200 OK**: Registration successful. (Example response body: User object)

---

### `POST /auth/refresh`

Refreshes an access token.

**Headers:**

*   `Authorization`: `Bearer <your_refresh_token>` (Required)

**Responses:**

*   **200 OK**: Token refresh successful.
    *   Body: `{ "accessToken": "string", "refreshToken": "string" }` (Example)

---

## Application (`/app`)

### `GET /app/health`

Checks the application\'s basic health.

**Responses:**

*   **200 OK**:
    ```json
    {
      "message": "ok"
    }
    ```

---

## Health Checks (`/health`)

### `GET /health`

Performs detailed health checks for various application components.

**Responses:**

*   **200 OK**: All health checks passed. (See `@nestjs/terminus` for exact response structure)
*   **503 Service Unavailable**: One or more health checks failed.

---

## Users (`/users`)

### `GET /users`

Retrieves a list of users based on query parameters.

**Query Parameters:** `UserQueryDto`
*   `page_number` (number, optional, default: 0)
*   `page_size` (number, optional, default: 20)
*   `subscription_status` (string enum, optional, e.g., `ACTIVE`, `INACTIVE`)
*   `subscription_type` (string enum, optional, e.g., `FREE`, `PREMIUM`)

**Responses:**

*   **200 OK**:
    *   Body: Array of `GetUsersDto`

---

### `GET /users/profile`

Retrieves the profile of the currently authenticated user.

**Authentication:** Bearer Token (`access-token`) required.

**Responses:**

*   **200 OK**:
    *   Body: `GetUserDto`

---

### `GET /users/:id`

Retrieves a specific user by their ID.

**Path Parameters:**
*   `id` (string, required): The ID of the user.

**Responses:**

*   **200 OK**:
    *   Body: `GetUserDto`
*   **404 Not Found**: User not found.

---

### `PATCH /users/change-password`

Allows the authenticated user to change their password.

**Authentication:** Bearer Token (`access-token`) required.

**Request Body:** `UserChangePasswordDto`
```json
{
  "old_password": "string (required, min length 6)",
  "new_password": "string (required, min length 6)"
}
```

**Responses:**

*   **200 OK**: Password successfully updated. (Message: "Пароль успешно обновлен")

---

### `PATCH /users/profile`

Allows the authenticated user to update their profile.

**Authentication:** Bearer Token (`access-token`) required.

**Request Body:** `UserUpdateDto`
```json
{
  "username": "string (optional)",
  "email": "string (optional, email format)"
}
```

**Responses:**

*   **200 OK**: Profile successfully updated.
    *   Body: `GetUsersDto` (Updated user data)
*   **404 Not Found**: User not found.


---

### `PATCH /users/:id`

Updates a specific user by their ID.

**Path Parameters:**
*   `id` (string, required): The ID of the user to update.

**Request Body:** `UserUpdateDto`
```json
{
  "username": "string (optional)",
  "email": "string (optional, email format)"
}
```

**Responses:**

*   **200 OK**: User successfully updated.
    *   Body: `GetUsersDto` (Updated user data)
*   **404 Not Found**: User not found.

---

### `DELETE /users/profile`

Deletes the profile of the currently authenticated user.

**Authentication:** Bearer Token (`access-token`) required.

**Responses:**

*   **200 OK**: Profile successfully deleted. (Message: "Профиль успешно удален")
*   **404 Not Found**: User not found.

---

### `DELETE /users/:id`

Deletes a specific user by their ID.

**Path Parameters:**
*   `id` (string, required): The ID of the user to delete.

**Responses:**

*   **200 OK**: User successfully deleted. (Message: "Пользователь успешно удален")
*   **404 Not Found**: User not found.

---

## Subscriptions (`/subscriptions`)

### `GET /subscriptions`

Retrieves a list of subscriptions based on query parameters.

**Query Parameters:** `QuerySubscriptionDto`
*   `page_number` (number, optional, default: 0)
*   `page_size` (number, optional, default: 20)
*   `status` (`SubscriptionStatus` string enum, optional)
*   `type` (`SubscriptionType` string enum, optional)

**Responses:**

*   **200 OK**:
    *   Body: Array of `GetSubscriptionsDto`

---

### `GET /subscriptions/:id`

Retrieves a specific subscription by its ID.

**Path Parameters:**
*   `id` (string, required): The ID of the subscription.

**Responses:**

*   **200 OK**:
    *   Body: `GetSubscriptionDto`
*   **404 Not Found**: Subscription not found.

---

### `POST /subscriptions`

Creates a new subscription.

**Request Body:** `CreateSubscriptionDto`
```json
{
  "type": "SubscriptionType (string enum, optional)",
  "template_id": "string (required)",
  "start_date": "Date (optional, default: now)",
  "end_date": "Date (optional)",
  "scans": "number (integer, required)"
}
```

**Responses:**

*   **201 Created**: Subscription created.
    *   Body: `GetSubscriptionsDto`

---

### `POST /subscriptions/:id/check-scans`

Checks and decrements the scan count for a subscription.

**Path Parameters:**
*   `id` (string, required): The ID of the subscription.

**Responses:**

*   **200 OK**: Scan count successfully decremented.
*   **403 Forbidden**: Subscription inactive.
*   **404 Not Found**: Subscription not found.
*   **429 Too Many Requests**: Scan limit exhausted.

---

### `PATCH /subscriptions/:id/template`

Changes the template for an existing subscription.

**Path Parameters:**
*   `id` (string, required): The ID of the subscription.

**Request Body:** `ChangeTemplateSubscriptionDto`
```json
{
  "template_id": "string (required)"
}
```

**Responses:**

*   **200 OK**: Subscription template updated.
*   **404 Not Found**: Subscription or template not found.

---

### `PATCH /subscriptions/:id`

Updates an existing subscription.

**Path Parameters:**
*   `id` (string, required): The ID of the subscription.

**Request Body:** `UpdateSubscriptionDto`
```json
{
  "status": "SubscriptionStatus (string enum, optional)",
  "scans": "number (integer, optional)",
  "end_date": "Date (optional)"
}
```

**Responses:**

*   **200 OK**: Subscription updated. (Body: Updated `GetSubscriptionDto` or similar)
*   **404 Not Found**: Subscription not found.

---

### `POST /subscriptions/renew`

Renews subscriptions based on query parameters.

**Query Parameters:** `QuerySubscriptionRenewDto`
*   `ids` (array of strings, optional): Specific subscription IDs to renew.
*   `status` (`SubscriptionStatus` string enum, optional): Renew subscriptions matching this status.
*   `type` (`SubscriptionType` string enum, optional): Renew subscriptions matching this type.

**Responses:**

*   **200 OK**: Subscriptions renewed. (Body: May contain a list of renewed subscriptions or a summary)

---

### `POST /subscriptions/:id/renew`

Renews a specific subscription.

**Path Parameters:**
*   `id` (string, required): The ID of the subscription to renew.

**Responses:**

*   **200 OK**: Subscription renewed.
    *   Body: `GetSubscriptionsDto`
*   **404 Not Found**: Subscription not found.

---

## Subscription Templates (`/subscription-template`)

### `GET /subscription-template`

Retrieves a list of subscription templates based on query parameters.

**Query Parameters:** `SubscriptionTemplateQueryDto`
*   `page_number` (number, optional, default: 0)
*   `page_size` (number, optional, default: 20)
*   `type` (`SubscriptionType` string enum, optional)
*   `min_price` (number, optional)
*   `max_price` (number, optional)
*   `min_limit` (number, optional)
*   `max_limit` (number, optional)
*   `version` (number, integer, optional)

**Responses:**

*   **200 OK**:
    *   Body: Array of `GetSubscriptionTemplateDto`

---

### `GET /subscription-template/:id`

Retrieves a specific subscription template by its ID.

**Path Parameters:**
*   `id` (string, required): The ID of the template.

**Responses:**

*   **200 OK**:
    *   Body: `GetSubscriptionTemplateDto`
*   **404 Not Found**: Template not found.

---

### `POST /subscription-template`

Creates a new subscription template.

**Request Body:** `CreateSubscriptionTemplateDto`
```json
{
  "type": "SubscriptionType (string enum, required)",
  "price": "number (required)",
  "limit": "number (integer, required)",
  "version": "number (integer, optional)"
}
```

**Responses:**

*   **201 Created**: Template created.
    *   Body: `GetSubscriptionTemplateDto`

---

### `PATCH /subscription-template/:id`

Updates an existing subscription template.

**Path Parameters:**
*   `id` (string, required): The ID of the template.

**Request Body:** `UpdateSubscriptionTemplateDto`
```json
{
  "type": "SubscriptionType (string enum, optional)",
  "price": "number (optional)",
  "limit": "number (integer, optional)",
  "version": "number (integer, optional)"
}
```

**Responses:**

*   **200 OK**: Template updated.
    *   Body: `GetSubscriptionTemplateDto`
*   **404 Not Found**: Template not found.

---

### `DELETE /subscription-template/:id`

Deletes a specific subscription template by its ID.

**Path Parameters:**
*   `id` (string, required): The ID of the template.

**Responses:**

*   **200 OK**: Template deleted.
*   **404 Not Found**: Template not found.

---

## DTOs & Enums

### General DTOs
#### `PageQueryDto`
*   `page_number`: number (optional, default: 0)
*   `page_size`: number (optional, default: 20)

### Auth DTOs
#### `UserLoginDto`
*   `login`: string (required) - User\'s login identifier (e.g., username or email).
*   `password`: string (required) - User\'s password.

#### `UserRegisterDto`
*   `username`: string (optional) - Desired username.
*   `email`: string (required, email format) - User\'s email address.
*   `password`: string (required, min length 6) - User\'s password.
*   `role`: `Role` (optional) - User\'s role.

### User DTOs
#### `UserQueryDto` (extends `PageQueryDto`)
*   `page_number`: number (optional, default: 0) - Page number for pagination.
*   `page_size`: number (optional, default: 20) - Number of items per page.
*   `subscription_status`: `SubscriptionStatus` (string enum, optional) - Filter by subscription status. From `@prisma/client`.
*   `subscription_type`: `SubscriptionType` (string enum, optional) - Filter by subscription type. From `@prisma/client`.

#### `GetUsersDto`
*   `id`: string - User\'s unique identifier.
*   `email`: string - User\'s email address.
*   `username`: string - User\'s username.
*   `role`: `Role` (enum) - User\'s role.
*   `subscription_id`: string - ID of the user\'s current subscription.
*   `created_at`: Date - Timestamp of user creation.

#### `GetUserDto` (extends `GetUsersDto`)
*   (Properties inherited from `GetUsersDto`)
*   `subscription`: `GetSubscriptionDto` - Detailed information about the user\'s subscription.

#### `UserUpdateDto`
*   `username`: string (optional) - New username.
*   `email`: string (optional, email format) - New email address.

#### `UserChangePasswordDto`
*   `old_password`: string (required, min length 6) - User\'s current password.
*   `new_password`: string (required, min length 6) - Desired new password.

### Subscription DTOs
#### `CreateSubscriptionDto`
*   `type`: `SubscriptionType` (string enum, optional) - Type for the new subscription. From `@prisma/client`.
*   `template_id`: string (required) - ID of the subscription template to use.
*   `start_date`: Date (optional, default: current date) - Start date of the subscription.
*   `end_date`: Date (optional) - End date of the subscription.
*   `scans`: number (integer, required) - Number of scans included in the subscription.

#### `UpdateSubscriptionDto`
*   `status`: `SubscriptionStatus` (string enum, optional) - New status for the subscription. From `@prisma/client`.
*   `scans`: number (integer, optional) - New scan count for the subscription.
*   `end_date`: Date (optional) - New end date for the subscription.

#### `ChangeTemplateSubscriptionDto`
*   `template_id`: string (required) - ID of the new subscription template.

#### `QuerySubscriptionDto` (extends `PageQueryDto`)
*   `page_number`: number (optional, default: 0)
*   `page_size`: number (optional, default: 20)
*   `status`: `SubscriptionStatus` (string enum, optional) - Filter by subscription status. From `@prisma/client`.
*   `type`: `SubscriptionType` (string enum, optional) - Filter by subscription type. From `@prisma/client`.

#### `QuerySubscriptionRenewDto`
*   `ids`: string[] (optional) - Array of specific subscription IDs to renew.
*   `status`: `SubscriptionStatus` (string enum, optional) - Renew subscriptions matching this status. From `@prisma/client`.
*   `type`: `SubscriptionType` (string enum, optional) - Renew subscriptions matching this type. From `@prisma/client`.

#### `GetSubscriptionDto` (extends `GetSubscriptionsDto`)
*   (Properties inherited from `GetSubscriptionsDto`)
*   `template`: `GetSubscriptionTemplateDto` - Detailed information about the subscription template.

#### `GetSubscriptionsDto`
*   `id`: string - Subscription\'s unique identifier.
*   `template_id`: string - ID of the subscription template used.
*   `scans`: number - Number of scans used/available in this subscription.
*   `start_date`: Date - Start date of the subscription.
*   `end_date`: Date - End date of the subscription.
*   `status`: `SubscriptionStatus` (string enum) - Current status of the subscription. From `@prisma/client`.

### Subscription Template DTOs
#### `CreateSubscriptionTemplateDto`
*   `type`: `SubscriptionType` (string enum, required) - Type of subscription template. From `@prisma/client`.
*   `price`: number (required) - Price of the template.
*   `limit`: number (integer, required) - Scan limit or other feature limit.
*   `version`: number (integer, optional) - Version of the template.

#### `UpdateSubscriptionTemplateDto`
*   `type`: `SubscriptionType` (string enum, optional) - New type for the template. From `@prisma/client`.
*   `price`: number (optional) - New price for the template.
*   `limit`: number (integer, optional) - New limit for the template.
*   `version`: number (integer, optional) - New version for the template.

#### `SubscriptionTemplateQueryDto` (extends `PageQueryDto`)
*   `page_number`: number (optional, default: 0)
*   `page_size`: number (optional, default: 20)
*   `type`: `SubscriptionType` (string enum, optional) - Filter by template type. From `@prisma/client`.
*   `min_price`: number (optional) - Filter by minimum price.
*   `max_price`: number (optional) - Filter by maximum price.
*   `min_limit`: number (optional) - Filter by minimum limit.
*   `max_limit`: number (optional) - Filter by maximum limit.
*   `version`: number (integer, optional) - Filter by template version.

#### `GetSubscriptionTemplateDto`
*   `id`: string - Template\'s unique identifier.
*   `type`: `SubscriptionType` (string enum) - Type of subscription. From `@prisma/client`.
*   `price`: number - Price of the subscription template.
*   `limit`: number - Scan limit or other feature limit for this template.
*   `version`: number - Version number of the template.
*   `created_at`: Date - Timestamp of template creation.
*   `updated_at`: Date - Timestamp of last template update.

### Enums
#### `Role`
*   `ADMIN`
*   `USER`

#### `SubscriptionStatus` (enum from `@prisma/client`)
*   *(Example values: `ACTIVE`, `INACTIVE`, `PENDING`, `CANCELED`, `EXPIRED`)* - Actual values depend on Prisma schema definition.

#### `SubscriptionType` (enum from `@prisma/client`)
*   *(Example values: `FREE`, `BASIC`, `PREMIUM`, `TRIAL`, `PREMIUM_MONTHLY`, `PREMIUM_ANNUAL`)* - Actual values depend on Prisma schema definition.

--- 