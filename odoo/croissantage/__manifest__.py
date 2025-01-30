{
    'name': 'Croissantage',
    "version": "18.0.1.0.0",
    'website': 'https://www.odoo.com/',
    'summary': 'Handle your croissantages like never before and never miss a croissant again.',
    'description': """Croissants ftw.""",
    'depends': [
        'contacts',
        'web_studio',
    ],
    'data': [
        'security/ir.model.access.csv',
        'views/croissantage.xml',
        'views/res_partner.xml',
        'data/mail_template_data.xml',
        'data/base_automation.xml',
        'data/ir_actions_server.xml',
    ],
    'installable': True,
    'auto_install': True,
    'application': True,
    'license': 'LGPL-3',
}
