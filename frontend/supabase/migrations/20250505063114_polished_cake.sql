/*
  # Create bills table and related schemas

  1. New Tables
    - `bills`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, references customers)
      - `month` (integer)
      - `year` (integer)
      - `total_amount` (decimal)
      - `is_paid` (boolean)
      - `paid_on` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `bills` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  month integer NOT NULL,
  year integer NOT NULL,
  total_amount decimal(10,2) NOT NULL DEFAULT 0,
  is_paid boolean DEFAULT false,
  paid_on timestamptz,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_month CHECK (month >= 1 AND month <= 12),
  CONSTRAINT valid_year CHECK (year >= 2000 AND year <= 2100)
);

ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bills"
  ON bills
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM customers WHERE id = customer_id
  ));

CREATE POLICY "Staff can manage all bills"
  ON bills
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'staff'
  );