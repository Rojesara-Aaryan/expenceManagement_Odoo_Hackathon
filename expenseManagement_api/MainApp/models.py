from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class Company(models.Model):
    companyId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    currency = models.CharField(max_length=3)  
    country = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(default=True)
    isDelete = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class CustomUser(AbstractUser):
    userId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(max_length=100, unique=True)
    name = models.CharField(max_length=100)
    contactNo = models.CharField(max_length=15)
    companyId = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='users')
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('employee', 'Employee'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='employee')
    status = models.BooleanField(default=True)
    isDelete = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_groups',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name', 'contactNo']

    def __str__(self):
        return self.username
    
class ExpenseCategory(models.Model):
    categoryId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    companyId = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='expense_categories')
    userId = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_categories')
    status = models.BooleanField(default=True)
    isDelete = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Expense(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    submitted_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='expenses')
    workflowId = models.ForeignKey('Workflow', on_delete=models.CASCADE, related_name='expenses')
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    currency = models.CharField(max_length=3)
    category = models.ForeignKey(ExpenseCategory, on_delete=models.CASCADE, related_name='expenses')
    description = models.TextField(blank=True)
    date = models.DateField()
    receipt = models.FileField(upload_to='receipts/', null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    isDelete = models.BooleanField(default=False)
    managerApproval = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    financeApproval = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    directorApproval = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    manager_approved_at = models.DateTimeField(null=True, blank=True)
    finance_approved_at = models.DateTimeField(null=True, blank=True)
    director_approved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Expense {self.id} by {self.submitted_by} ({self.amount} {self.currency})"

class Workflow(models.Model):
    workflowId = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    companyId = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='workflows')
    name = models.CharField(max_length=255)
    threshold_min = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    threshold_max = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    is_manager_approver = models.BooleanField(default=False)
    approval_type = models.CharField(
        max_length=20,
        choices=[
            ('sequential', 'Sequential'),
            ('percentage', 'Percentage'),
            ('specific', 'Specific'),
            ('hybrid', 'Hybrid'),
        ],
        default='sequential'
    )
    percentage_required = models.FloatField(null=True, blank=True)  # e.g., 60.0 for 60%
    specific_approver = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='specific_workflows'
    )
    isDelete = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.companyId})"

class WorkflowApprover(models.Model):
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name='approvers')
    approver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='approver_roles')
    is_employee_manager = models.BooleanField(default=False)  # If true, uses the expense submitter's manager
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Approver for {self.workflow} (Order: {self.order})"