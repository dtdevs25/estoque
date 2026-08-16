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

export async function sendPasswordSetupEmail(to: string, name: string, token: string) {
  const url = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"EstoqueEPI" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Bem-vindo ao EstoqueEPI — Configure sua senha',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#660099;">Bem-vindo, ${name}!</h2>
        <p>Seu acesso ao <strong>EstoqueEPI</strong> foi criado. Clique no botão abaixo para definir sua senha:</p>
        <a href="${url}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#660099;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">
          Definir Minha Senha
        </a>
        <p style="color:#6b7280;font-size:12px;">Este link expira em 24 horas. Se não solicitou este acesso, ignore este e-mail.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const url = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"EstoqueEPI" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Redefinição de senha — EstoqueEPI',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#660099;">Redefinição de Senha</h2>
        <p>Olá, <strong>${name}</strong>! Recebemos uma solicitação de redefinição de senha.</p>
        <a href="${url}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#660099;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">
          Redefinir Senha
        </a>
        <p style="color:#6b7280;font-size:12px;">Este link expira em 1 hora. Se não solicitou isso, ignore este e-mail.</p>
      </div>
    `,
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
