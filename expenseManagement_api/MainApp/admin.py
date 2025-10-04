from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Company, CustomUser, ExpenseCategory, Expense, Workflow, WorkflowApprover

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'companyId', 'currency', 'created_at', 'status', 'isDelete')
    search_fields = ('name', 'companyId')
    list_filter = ('status', 'isDelete', 'currency')
    ordering = ('name',)
    readonly_fields = ('companyId', 'created_at')

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'userId', 'email', 'name', 'companyId', 'role', 'status', 'isDelete')
    search_fields = ('username', 'email', 'name', 'userId')
    list_filter = ('role', 'status', 'isDelete', 'companyId')
    fieldsets = (
        (None, {'fields': ('userId', 'username', 'email', 'password')}),
        ('Personal Info', {'fields': ('name', 'contactNo', 'companyId', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Status', {'fields': ('status', 'isDelete')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'name', 'contactNo', 'companyId', 'role', 'status'),
        }),
    )
    readonly_fields = ('userId',)
    ordering = ('username',)
    filter_horizontal = ('groups', 'user_permissions')

@admin.register(ExpenseCategory)
class ExpenseCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'categoryId', 'companyId', 'userId', 'status', 'isDelete')
    search_fields = ('name', 'categoryId')
    list_filter = ('status', 'isDelete', 'companyId')
    ordering = ('name',)
    readonly_fields = ('categoryId',)

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'submitted_by', 'workflowId', 'amount', 'currency', 'category',
        'status', 'managerApproval', 'financeApproval', 'directorApproval', 'created_at', 'isDelete'
    )
    search_fields = ('submitted_by__username', 'description', 'amount')
    list_filter = (
        'status', 'managerApproval', 'financeApproval', 'directorApproval',
        'isDelete', 'currency', 'category', 'workflowId'
    )
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
    date_hierarchy = 'date'
    list_per_page = 20

@admin.register(Workflow)
class WorkflowAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'workflowId', 'companyId', 'threshold_min', 'threshold_max',
        'approval_type', 'percentage_required', 'is_manager_approver', 'isDelete'
    )
    search_fields = ('name', 'workflowId')
    list_filter = ('approval_type', 'is_manager_approver', 'isDelete', 'companyId')
    ordering = ('name',)
    readonly_fields = ('workflowId',)

@admin.register(WorkflowApprover)
class WorkflowApproverAdmin(admin.ModelAdmin):
    list_display = ('workflow', 'approver', 'is_employee_manager', 'order')
    search_fields = ('workflow__name', 'approver__username')
    list_filter = ('is_employee_manager', 'workflow')
    ordering = ('workflow', 'order')