class AddAdminToEvents < ActiveRecord::Migration[6.0]
  def change
    add_reference :events, :admin
  end
end
