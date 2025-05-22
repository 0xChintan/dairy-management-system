/*
  # Create entries table
  
  1. New Tables
    - `entries`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key to customers)
      - `date` (date)
      - `product` (text)
      - `quantity` (decimal)
      - `price_per_unit` (decimal)
      - `amount` (decimal)
      - `is_paid` (boolean)
      - `paid_on` (timestamp)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  date date NOT NULL,
  product text NOT NULL,
  quantity decimal(10,2) NOT NULL,
  price_per_unit decimal(10,2) NOT NULL,
  amount decimal(10,2) NOT NULL,
  is_paid boolean DEFAULT false,
  paid_on timestamptz,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT positive_quantity CHECK (quantity > 0),
  CONSTRAINT positive_price CHECK (price_per_unit > 0),
  CONSTRAINT positive_amount CHECK (amount > 0)
);

ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own entries"
  ON entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM customers WHERE id = customer_id
  ));

CREATE POLICY "Staff can manage all entries"
  ON entries
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'staff');