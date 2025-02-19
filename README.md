## Быстрый старт

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/pyfig/MonitoringMachine.git
   cd MonitoringMachine/src
   ```

2. Запустите стек мониторинга:
   ```bash
   docker-compose up -d
   ```

3. Доступ к сервисам:
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3000

## Конфигурация

### Prometheus

Конфигурация Prometheus определена в файле `src/prometheus.yml`. Стандартная конфигурация включает:

- 15-секундный интервал сбора метрик
- Сбор метрик Node exporter (host.docker.internal:9100)
- Самомониторинг Prometheus

Для добавления новых целей мониторинга:

1. Отредактируйте `src/prometheus.yml`
2. Добавьте новые конфигурации задач в раздел `scrape_configs`
3. Перезапустите Prometheus: `docker-compose restart prometheus`

### Grafana

Стандартные учетные данные:
- Имя пользователя: admin
- Пароль: admin

После первого входа вам будет предложено изменить пароль.

#### Настройка дашбордов

1. Войдите в Grafana
2. Добавьте Prometheus как источник данных:
   - Нажмите на Конфигурация (значок шестеренки) > Источники данных
   - Нажмите "Добавить источник данных"
   - Выберите "Prometheus"
   - Укажите URL: http://prometheus:9090
   - Нажмите "Сохранить и протестировать"

3. Импортируйте дашборд:
   - Нажмите "+" > Импорт
   - Введите ID дашборда (например, 1860 для Node Exporter Full)
   - Выберите ваш источник данных Prometheus
   - Нажмите "Импорт"

## Мониторинг ваших приложений

1. Добавьте в ваше приложение библиотеку клиента Prometheus
2. Добавьте конечную точку метрик в `prometheus.yml`:
   ```yaml
   scrape_configs:
     - job_name: 'your-app'
       static_configs:
         - targets: ['your-app:port']
   ```
3. Перезапустите Prometheus

## Устранение неполадок

### Распространенные проблемы

1. Нет доступа к Grafana/Prometheus
   - Проверьте, запущены ли контейнеры: `docker-compose ps`
   - Проверьте логи: `docker-compose logs grafana` или `docker-compose logs prometheus`

2. Метрики не отображаются
   - Проверьте статус цели в Prometheus UI > Targets
   - Проверьте сетевое подключение между Prometheus и целью
   - Убедитесь, что конечная точка метрик доступна

### Просмотр логов

```bash
# Просмотр логов всех сервисов
docker-compose logs

# Просмотр логов определенного сервиса
docker-compose logs [service_name]

# Отслеживание логов в реальном времени
docker-compose logs -f [service_name]
```
