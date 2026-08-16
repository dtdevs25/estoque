import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function getBaseEmailHtml(title: string, subtitle: string, contentHtml: string, ctaUrl: string, ctaText: string) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#F4F1F8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#F4F1F8" style="background-color:#F4F1F8;padding:40px 10px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:580px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(102,0,153,0.12);border:1px solid #E9E1F0;">
          
          <!-- Header Banner with Solid Vivo Purple Fallback -->
          <tr>
            <td bgcolor="#660099" style="background-color:#660099;background:linear-gradient(135deg, #4B0072 0%, #660099 100%);padding:36px 32px;text-align:center;">
              
              <!-- Brand Emblem Pill -->
              <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 16px auto;">
                <tr>
                  <td bgcolor="#4B0072" style="background-color:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.4);border-radius:20px;padding:6px 18px;">
                    <span style="color:#ffffff;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">
                      VIVO &bull; SG4 &nbsp;|&nbsp; EstoqueEPI
                    </span>
                  </td>
                </tr>
              </table>

              <h1 style="color:#ffffff;font-family:Arial,sans-serif;font-size:24px;font-weight:bold;margin:0 0 8px 0;letter-spacing:-0.5px;">${title}</h1>
              <p style="color:#E9D5FF;font-family:Arial,sans-serif;font-size:14px;margin:0;font-weight:normal;">${subtitle}</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding:36px 32px;">
              ${contentHtml}

              <!-- Bulletproof Table-Based CTA Button (Solid Vivo Purple) -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:32px 0;">
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" bgcolor="#660099" style="background-color:#660099;border-radius:12px;padding:16px 36px;box-shadow:0 4px 14px rgba(102,0,153,0.4);">
                          <a href="${ctaUrl}" target="_blank" style="color:#ffffff;background-color:#660099;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;text-decoration:none;display:inline-block;">
                            ${ctaText} &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#FAF7FC" style="background-color:#FAF7FC;border:1px solid #E9E1F0;border-radius:12px;margin-top:28px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 6px 0;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:#660099;">🔒 Informação de Segurança Vivo SG4</p>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#64748b;line-height:1.5;">
                      Este link é individual, confidencial e seguro. Por motivos de proteção de dados SG4 Vivo, ele possui validade temporária. Se você não solicitou este e-mail, por favor desconsidere-o.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- URL Fallback -->
              <div style="margin-top:24px;padding-top:20px;border-top:1px solid #F1F5F9;font-family:Arial,sans-serif;font-size:11px;color:#94a3b8;word-break:break-all;">
                Se o botão acima não abrir, copie e cole o seguinte endereço no seu navegador:<br>
                <a href="${ctaUrl}" style="color:#660099;text-decoration:underline;">${ctaUrl}</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#FAF7FC" style="background-color:#FAF7FC;padding:20px 32px;border-top:1px solid #E9E1F0;text-align:center;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#94a3b8;line-height:1.6;">
                <strong style="color:#660099;">EstoqueEPI &bull; Vivo SG4</strong> — Sistema de Gestão de Equipamentos de Proteção<br>
                Mensagem enviada automaticamente. Favor não responder a este remetente.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function sendPasswordSetupEmail(to: string, name: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const url = `${baseUrl}/reset-password?token=${token}`;
  
  const content = `
    <h2 style="font-size:18px;font-weight:700;color:#0f172a;margin:0 0 12px 0;">Olá, ${name}! 👋</h2>
    <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 20px 0;">
      Seu acesso à plataforma <strong>EstoqueEPI Vivo</strong> foi criado com sucesso pelo administrador do sistema.
    </p>
    <div style="background-color:#F8FAFC;border-left:4px solid #660099;padding:14px 18px;border-radius:0 8px 8px 0;margin-bottom:20px;">
      <p style="margin:0;font-size:13px;color:#334155;line-height:1.5;">
        <strong>Conta:</strong> ${to}<br>
        <strong>Validade do Link:</strong> 24 horas
      </p>
    </div>
    <p style="font-size:14px;color:#475569;line-height:1.6;margin:0;">
      Para começar a utilizar o sistema, clique no botão abaixo para definir sua senha de acesso pessoal:
    </p>
  `;

  await transporter.sendMail({
    from: `"EstoqueEPI Vivo" <${process.env.SMTP_USER}>`,
    to,
    subject: '🎉 Bem-vindo ao EstoqueEPI Vivo — Configure sua senha de acesso',
    html: getBaseEmailHtml('Definição de Senha', 'Seu acesso ao EstoqueEPI foi criado', content, url, 'Definir Minha Senha'),
  });
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const url = `${baseUrl}/reset-password?token=${token}`;

  const content = `
    <h2 style="font-size:18px;font-weight:700;color:#0f172a;margin:0 0 12px 0;">Olá, ${name}! 👋</h2>
    <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 20px 0;">
      Recebemos uma solicitação de redefinição de senha para sua conta no <strong>EstoqueEPI Vivo</strong>.
    </p>
    <div style="background-color:#F8FAFC;border-left:4px solid #660099;padding:14px 18px;border-radius:0 8px 8px 0;margin-bottom:20px;">
      <p style="margin:0;font-size:13px;color:#334155;line-height:1.5;">
        <strong>Conta:</strong> ${to}<br>
        <strong>Validade do Link:</strong> 1 hora
      </p>
    </div>
    <p style="font-size:14px;color:#475569;line-height:1.6;margin:0;">
      Clique no botão abaixo para escolher uma nova senha de acesso com total segurança:
    </p>
  `;

  await transporter.sendMail({
    from: `"EstoqueEPI Vivo" <${process.env.SMTP_USER}>`,
    to,
    subject: '🔐 Redefinição de Senha — EstoqueEPI Vivo',
    html: getBaseEmailHtml('Redefinição de Senha', 'Solicitação de nova senha de acesso', content, url, 'Redefinir Senha'),
  });
}

export async function sendLowStockAlert(itemName: string, locationName: string, quantity: number, minQuantity: number) {
  try {
    const webhookUrl = process.env.N8N_WEBHOOK_ESTOQUE_BAIXO;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName, locationName, quantity, minQuantity, timestamp: new Date().toISOString() }),
      });
    }
  } catch (e) {
    console.warn('N8N webhook failed:', e);
  }
}
