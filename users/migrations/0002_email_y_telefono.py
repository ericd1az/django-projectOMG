from django.db import migrations, models


def completar_correos_vacios(apps, schema_editor):
    User = apps.get_model('users', 'User')
    for user in User.objects.using(schema_editor.connection.alias).filter(email=''):
        user.email = f'usuario-{user.pk}@local.invalid'
        user.save(update_fields=['email'])


class Migration(migrations.Migration):
    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(completar_correos_vacios, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=254, unique=True),
        ),
        migrations.AddField(
            model_name='user',
            name='telefono',
            field=models.CharField(blank=True, max_length=20, verbose_name='Teléfono'),
        ),
    ]
