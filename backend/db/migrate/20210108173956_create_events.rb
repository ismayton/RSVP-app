class CreateEvents < ActiveRecord::Migration[6.0]
  def change
    create_table :events do |t|
      t.string :title
      t.string :date
      t.string :location
      t.string :description
      t.integer :capacity
      
      t.timestamps
    end
  end
end
