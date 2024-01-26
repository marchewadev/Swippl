const BaseModel = require("./baseModel");
const {
  banUserSchema,
  createAdminSchema,
  deleteAdminSchema,
  unbanUserSchema,
} = require("./adminSchema");

class AdminModel extends BaseModel {
  async checkIfUserIsAdmin(userId) {
    // This function checks if the user with the given ID is an administrator. If the user is an administrator, the function returns true, otherwise it returns false.
    const admin = await this.pool.query(
      "SELECT id FROM admins WHERE user_id = $1",
      [userId]
    );

    if (!admin.rows.length > 0) {
      return false;
    }

    return admin.rows[0].id;
  }

  async checkIfAdminIsSuperadmin(adminId) {
    // This function checks if the admin with the given ID is a superadmin. If the admin is superadmin, the function returns true, otherwise it throws an error.
    const superuser = await this.pool.query(
      "SELECT id FROM admins WHERE id = $1",
      [adminId]
    );

    if (superuser.rows[0].id !== 1) {
      throw {
        status: 403,
        message: "Nie masz uprawnień do tworzenia nowych administratorów",
      };
    }
  }

  async createAdminByUserId(adminJSON, adminId) {
    // This function creates a new admin in the admins table. After creating a new admin, a record is added to the admin_actions table, which allows for later verification of who and when created the admin. The function can only be used by the superadmin.

    try {
      await createAdminSchema.validate(adminJSON);
      await this.checkIfAdminIsSuperadmin(adminId);

      // Start transaction
      await this.pool.query("BEGIN");

      // Insert new row into admins table
      const adminsQuery = "INSERT INTO admins(user_id) VALUES($1)";
      const adminsValues = [adminJSON.userId];

      await this.pool.query(adminsQuery, adminsValues);

      // Insert new row into admin_actions table
      const adminActionsQuery = `INSERT INTO admin_actions(
        user_id,
        admin_id,
        action
      ) VALUES($1, $2, $3)`;
      const adminActionsValues = [adminJSON.userId, adminId, "create_admin"];

      await this.pool.query(adminActionsQuery, adminActionsValues);

      // Commit transaction
      await this.pool.query("COMMIT");

      return;
    } catch (err) {
      // Rollback transaction in case of error
      await this.pool.query("ROLLBACK");
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  async deleteAdminById(adminJSON, adminId) {
    // This function deletes an admin from the admins table. After deleting an admin, a record is added to the admin_actions table, which allows for later verification of who and when deleted the admin. The function can only be used by the superadmin.
    try {
      await deleteAdminSchema.validate(adminJSON);
      await this.checkIfAdminIsSuperadmin(adminId);

      // Start transaction
      await this.pool.query("BEGIN");

      // Delete row from admins table and return the deleted row to use it in the next query
      const adminsQuery = "DELETE FROM admins WHERE id = $1 RETURNING *";
      const adminsValues = [adminJSON.adminId];

      const admin = await this.pool.query(adminsQuery, adminsValues);

      // Insert new row into admin_actions table
      const adminActionsQuery = `INSERT INTO admin_actions(
        user_id,
        admin_id,
        action
      ) VALUES($1, $2, $3)`;

      const adminActionsValues = [
        admin.rows[0].user_id,
        adminId,
        "delete_admin",
      ];

      await this.pool.query(adminActionsQuery, adminActionsValues);

      // Commit transaction
      await this.pool.query("COMMIT");
    } catch (err) {
      // Rollback transaction in case of error
      await this.pool.query("ROLLBACK");
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  async banUserById(adminJSON, adminId) {
    // This function adds a user to the banned_users table, which results in a ban. After the ban is imposed, a record is added to the admin_actions table, which allows for later verification of who, why and when banned the user.

    try {
      await banUserSchema.validate(adminJSON);

      // Start transaction
      await this.pool.query("BEGIN");

      // Insert new row into banned_users table
      const bannedUsersQuery =
        "INSERT INTO banned_users(user_id, reason, ban_until) VALUES($1, $2, $3)";
      const bannedUsersValues = [
        adminJSON.userId,
        adminJSON.reason,
        adminJSON.banUntil,
      ];

      await this.pool.query(bannedUsersQuery, bannedUsersValues);

      // Insert new row into admin_actions table
      const adminActionsQuery =
        "INSERT INTO admin_actions(user_id, admin_id, action) VALUES($1, $2, $3)";
      const adminActionsValues = [adminJSON.userId, adminId, "ban"];

      await this.pool.query(adminActionsQuery, adminActionsValues);

      // Commit transaction
      await this.pool.query("COMMIT");

      return;
    } catch (err) {
      // Rollback transaction in case of error
      await this.pool.query("ROLLBACK");
      this.handleValidationErrorOrServerIssue(err);
    }
  }

  async unbanUserById(adminJSON, adminId) {
    // This function allows for manual unbanning of a user instead of relying directly on scheduled tasks in the PostgreSQL database. It is useful when a user contacts the administrator requesting unbanning or when a database error occurs. Upon lifting a ban, a record is added to the admin_actions table, allowing for later verification of who and when unbanned the user.

    try {
      await unbanUserSchema.validate(adminJSON);

      // Start transaction
      await this.pool.query("BEGIN");

      // Delete row from banned_users table
      const bannedUsersQuery = "DELETE FROM banned_users WHERE user_id = $1";
      const bannedUsersValues = [adminJSON.userId];

      await this.pool.query(bannedUsersQuery, bannedUsersValues);

      // Insert new row into admin_actions table
      const adminActionsQuery =
        "INSERT INTO admin_actions(user_id, admin_id, action) VALUES($1, $2, $3)";
      const adminActionsValues = [adminJSON.userId, adminId, "unban"];

      await this.pool.query(adminActionsQuery, adminActionsValues);

      await this.pool.query("COMMIT"); // Commit transaction
      return;
    } catch (err) {
      // Rollback transaction in case of error
      await this.pool.query("ROLLBACK");
      this.handleValidationErrorOrServerIssue(err);
    }
  }
}

module.exports = new AdminModel();
