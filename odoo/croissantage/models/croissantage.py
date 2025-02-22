from odoo import models, fields, api, _
from odoo.exceptions import UserError

class Croissantage(models.Model):
    _name = 'croissantage'
    _inherit = 'mail.thread'

    name = fields.Char()
    partner_id = fields.Many2one('res.partner')

    #Other possibility, add a Many2many instead of name
    partner_ids = fields.Many2many('res.partner')

    state = fields.Selection(
        [
            ('new', 'Croissanté'),
            ('ongoing','Croissants ramenés'),
            ('done', 'Dette payée')
        ],
        default='new'
    )

    date_begin = fields.Date('Date de croissantage', default=fields.Date.today())
    date_end = fields.Date('Date de dette payée')

    duration = fields.Integer(compute='_compute_duration')

    city = fields.Char(related='partner_id.city')

    def act_validate(self):
        self.ensure_one()
        self.state = 'done'

    @api.depends('date_begin', 'date_end')
    def _compute_duration(self):
        for rec in self:
            if rec.date_end:
                rec.duration = abs((rec.date_begin - rec.date_end).days)
            else:
                rec.duration = 0

    @api.constrains('date_begin', 'date_end')
    def _check_dates(self):
        for rec in self:
            if rec.date_end and rec.date_end < rec.date_begin:
                raise UserError(_('Date de fin doit être plus grande que la date de début'))

    def action_send_croissantage_mail(self):
        self.ensure_one()
        template_id = self.env.ref('croissantage.mail_template_send_croissantage')
        ctx = {
            'default_email_layout_xmlid': 'mail.mail_notification_light',
            'default_model': 'croissantage',
            'default_res_ids': self.ids,
            'default_template_id': template_id.id,
            'default_composition_mode': 'comment',
            'default_from': self.env.user.partner_id.id,
        }
        return {
            'type': 'ir.actions.act_window',
            'view_mode': 'form',
            'res_model': 'mail.compose.message',
            'views': [[False, 'form']],
            'target': 'new',
            'context': ctx,
        }
