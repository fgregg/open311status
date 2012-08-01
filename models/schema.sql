CREATE TABLE IF NOT EXISTS "pings" (
  "id"   SERIAL,
  "servicesping_count" INTEGER, 
  "servicesping_timer" INTEGER, 
  "requestsping_count" INTEGER, 
  "requestsping_timer" INTEGER,
  "created_at" TIMESTAMP, 
  "requested_at" TIMESTAMP, 

  PRIMARY KEY ("id")
);


CREATE TABLE IF NOT EXISTS "services_pings" (
  "id" SERIAL,
  "ping_id" INTEGER,
  "endpoint" VARCHAR(255), 
  "status_code" INTEGER, 
  "response_time" INTEGER, 
  "services_count" INTEGER, 
  "created_at" TIMESTAMP, 
  "requested_at" TIMESTAMP,  

  PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "requests_pings" (
  "id" SERIAL,
  "ping_id" INTEGER,
  "endpoint" VARCHAR(255), 
  "status_code" INTEGER, 
  "response_time" INTEGER, 
  "requests_count" INTEGER, 
  "created_at" TIMESTAMP, 
  "requested_at" TIMESTAMP,  

  PRIMARY KEY ("id")
);