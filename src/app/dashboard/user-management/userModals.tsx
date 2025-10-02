"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createUser,
  updateUserProfile,
  manageUserRole,
  toggleUserStatus,
} from "@/app/dashboard/user-management/actions";
import type { UserProfile } from "@/app/dashboard/user-management/page";
import { Loader2 } from "lucide-react";

const actionInitialState: { error?: string; success?: string } = {};

// --- MODAL 1: Create New User ---

export function CreateUserModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [message, setMessage] = useState(actionInitialState);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    async (
      prevState: { error?: string; success?: string },
      formData: FormData
    ) => {
      const result = await createUser(prevState, formData);
      setMessage(result);
      return result;
    },
    actionInitialState
  );

  useEffect(() => {
    if (message?.success) {
      const timer = setTimeout(onClose, 1500);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  useEffect(() => {
    if (isOpen) {
      setMessage(actionInitialState);
      formRef.current?.reset();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            This will create a new user and their profile.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} ref={formRef} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" name="full_name" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="job_title">Job Title</Label>
              <Input id="job_title" name="job_title" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="department">Department</Label>
              <Input id="department" name="department" />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Initial Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="role">Role</Label>
            <Select name="role" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="it_staff">IT Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <div className="w-full text-center mr-4">
              {message?.error && (
                <p className="text-red-500 text-sm">{message.error}</p>
              )}
              {message?.success && (
                <p className="text-green-500 text-sm">{message.success}</p>
              )}
            </div>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- MODAL 2: Edit, Manage, and Deactivate User ---

export function UserDetailsModal({
  user,
  onClose,
}: {
  user: UserProfile | null;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState("edit");

  useEffect(() => {
    if (user) {
      setActiveTab("edit"); // Reset to default tab when a new user is selected
    }
  }, [user]);

  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user.full_name}</DialogTitle>
          <DialogDescription>{user.email}</DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-4 py-2 ${
              activeTab === "edit"
                ? "border-b-2 border-purple-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab("role")}
            className={`px-4 py-2 ${
              activeTab === "role"
                ? "border-b-2 border-purple-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Manage Role
          </button>
          <button
            onClick={() => setActiveTab("status")}
            className={`px-4 py-2 ${
              activeTab === "status"
                ? "border-b-2 border-red-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Account Status
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-4 min-h-[220px]">
          {activeTab === "edit" && (
            <EditProfileForm user={user} onSuccess={onClose} />
          )}
          {activeTab === "role" && (
            <ManageRoleForm user={user} onSuccess={onClose} />
          )}
          {activeTab === "status" && (
            <AccountStatusForm user={user} onSuccess={onClose} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Sub-components for UserDetailsModal tabs ---

function EditProfileForm({
  user,
  onSuccess,
}: {
  user: UserProfile;
  onSuccess: () => void;
}) {
  const [state, formAction, isPending] = useActionState(
    updateUserProfile,
    actionInitialState
  );
  useEffect(() => {
    if (state?.success) setTimeout(onSuccess, 1000);
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="user_id" value={user.id} />
      <div className="space-y-1">
        <Label htmlFor="full_name_edit">Full Name</Label>
        <Input
          id="full_name_edit"
          name="full_name"
          defaultValue={user.full_name ?? ""}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="job_title_edit">Job Title</Label>
          <Input
            id="job_title_edit"
            name="job_title"
            defaultValue={user.job_title ?? ""}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="department_edit">Department</Label>
          <Input
            id="department_edit"
            name="department"
            defaultValue={user.department ?? ""}
          />
        </div>
      </div>
      <div className="flex justify-end items-center gap-4">
        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
        {state?.success && (
          <p className="text-green-500 text-sm">{state.success}</p>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}

function ManageRoleForm({
  user,
  onSuccess,
}: {
  user: UserProfile;
  onSuccess: () => void;
}) {
  const [state, formAction, isPending] = useActionState(
    manageUserRole,
    actionInitialState
  );
  useEffect(() => {
    if (state?.success) setTimeout(onSuccess, 1000);
  }, [state, onSuccess]);

  if (user.role === "admin") {
    return (
      <p className="text-gray-600">
        Admin roles cannot be changed from this panel.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="user_id" value={user.id} />
      <div className="space-y-1">
        <Label htmlFor="role_manage">User Role</Label>
        <Select name="role" defaultValue={user.role} required>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="employee">Employee</SelectItem>
            <SelectItem value="it_staff">IT Staff</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end items-center gap-4">
        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
        {state?.success && (
          <p className="text-green-500 text-sm">{state.success}</p>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
            </>
          ) : (
            "Update Role"
          )}
        </Button>
      </div>
    </form>
  );
}

function AccountStatusForm({
  user,
  onSuccess,
}: {
  user: UserProfile;
  onSuccess: () => void;
}) {
  const [state, formAction, isPending] = useActionState(
    toggleUserStatus,
    actionInitialState
  );
  useEffect(() => {
    if (state?.success) setTimeout(onSuccess, 1000);
  }, [state, onSuccess]);

  const actionText = user.is_active ? "Deactivate" : "Reactivate";

  if (user.role === "admin") {
    return (
      <p className="text-gray-600">Admin accounts cannot be deactivated.</p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="user_id" value={user.id} />
      <input type="hidden" name="is_active" value={user.is_active.toString()} />
      <p>
        This user&apos;s account is currently{" "}
        <strong>{user.is_active ? "Active" : "Deactivated"}</strong>.
      </p>
      <p className="text-sm text-gray-600">
        {user.is_active
          ? "Deactivating the account will suspend the user's access to the system."
          : "Reactivating the account will restore the user's access."}
      </p>
      <div className="flex justify-end items-center gap-4">
        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
        {state?.success && (
          <p className="text-green-500 text-sm">{state.success}</p>
        )}
        <Button variant="destructive" type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
            </>
          ) : (
            `${actionText} Account`
          )}
        </Button>
      </div>
    </form>
  );
}
