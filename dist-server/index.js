// server/index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit2 from "express-rate-limit";
import path2 from "path";
import { fileURLToPath } from "url";

// server/routes/auth.ts
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt2 from "jsonwebtoken";
import crypto from "crypto";
import rateLimit from "express-rate-limit";

// server/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
var prisma = global.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error"] : []
});
if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}

// server/middleware/auth.ts
import jwt from "jsonwebtoken";
function authenticate(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ message: "N\xE3o autenticado." });
    return;
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: "Token inv\xE1lido ou expirado." });
  }
}
function requireAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") {
    res.status(403).json({ message: "Apenas administradores podem realizar esta a\xE7\xE3o." });
    return;
  }
  next();
}
function requireAdminOrController(req, res, next) {
  if (req.user?.role === "VIEWER") {
    res.status(403).json({ message: "Visualizadores n\xE3o podem modificar dados." });
    return;
  }
  next();
}

// server/lib/email.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
function getBaseEmailHtml(title, subtitle, contentHtml, ctaUrl, ctaText) {
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
                    <p style="margin:0 0 6px 0;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:#660099;">\u{1F512} Informa\xE7\xE3o de Seguran\xE7a Vivo SG4</p>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#64748b;line-height:1.5;">
                      Este link \xE9 individual, confidencial e seguro. Por motivos de prote\xE7\xE3o de dados SG4 Vivo, ele possui validade tempor\xE1ria. Se voc\xEA n\xE3o solicitou este e-mail, por favor desconsidere-o.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- URL Fallback -->
              <div style="margin-top:24px;padding-top:20px;border-top:1px solid #F1F5F9;font-family:Arial,sans-serif;font-size:11px;color:#94a3b8;word-break:break-all;">
                Se o bot\xE3o acima n\xE3o abrir, copie e cole o seguinte endere\xE7o no seu navegador:<br>
                <a href="${ctaUrl}" style="color:#660099;text-decoration:underline;">${ctaUrl}</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#FAF7FC" style="background-color:#FAF7FC;padding:20px 32px;border-top:1px solid #E9E1F0;text-align:center;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#94a3b8;line-height:1.6;">
                <strong style="color:#660099;">EstoqueEPI &bull; Vivo SG4</strong> \u2014 Sistema de Gest\xE3o de Equipamentos de Prote\xE7\xE3o<br>
                Mensagem enviada automaticamente. Favor n\xE3o responder a este remetente.
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
async function sendPasswordSetupEmail(to, name, token) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const url = `${baseUrl}/reset-password?token=${token}`;
  const content = `
    <h2 style="font-size:18px;font-weight:700;color:#0f172a;margin:0 0 12px 0;">Ol\xE1, ${name}! \u{1F44B}</h2>
    <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 20px 0;">
      Seu acesso \xE0 plataforma <strong>EstoqueEPI Vivo</strong> foi criado com sucesso pelo administrador do sistema.
    </p>
    <div style="background-color:#F8FAFC;border-left:4px solid #660099;padding:14px 18px;border-radius:0 8px 8px 0;margin-bottom:20px;">
      <p style="margin:0;font-size:13px;color:#334155;line-height:1.5;">
        <strong>Conta:</strong> ${to}<br>
        <strong>Validade do Link:</strong> 24 horas
      </p>
    </div>
    <p style="font-size:14px;color:#475569;line-height:1.6;margin:0;">
      Para come\xE7ar a utilizar o sistema, clique no bot\xE3o abaixo para definir sua senha de acesso pessoal:
    </p>
  `;
  await transporter.sendMail({
    from: `"EstoqueEPI Vivo" <${process.env.SMTP_USER}>`,
    to,
    subject: "\u{1F389} Bem-vindo ao EstoqueEPI Vivo \u2014 Configure sua senha de acesso",
    html: getBaseEmailHtml("Defini\xE7\xE3o de Senha", "Seu acesso ao EstoqueEPI foi criado", content, url, "Definir Minha Senha")
  });
}
async function sendPasswordResetEmail(to, name, token) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const url = `${baseUrl}/reset-password?token=${token}`;
  const content = `
    <h2 style="font-size:18px;font-weight:700;color:#0f172a;margin:0 0 12px 0;">Ol\xE1, ${name}! \u{1F44B}</h2>
    <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 20px 0;">
      Recebemos uma solicita\xE7\xE3o de redefini\xE7\xE3o de senha para sua conta no <strong>EstoqueEPI Vivo</strong>.
    </p>
    <div style="background-color:#F8FAFC;border-left:4px solid #660099;padding:14px 18px;border-radius:0 8px 8px 0;margin-bottom:20px;">
      <p style="margin:0;font-size:13px;color:#334155;line-height:1.5;">
        <strong>Conta:</strong> ${to}<br>
        <strong>Validade do Link:</strong> 1 hora
      </p>
    </div>
    <p style="font-size:14px;color:#475569;line-height:1.6;margin:0;">
      Clique no bot\xE3o abaixo para escolher uma nova senha de acesso com total seguran\xE7a:
    </p>
  `;
  await transporter.sendMail({
    from: `"EstoqueEPI Vivo" <${process.env.SMTP_USER}>`,
    to,
    subject: "\u{1F510} Redefini\xE7\xE3o de Senha \u2014 EstoqueEPI Vivo",
    html: getBaseEmailHtml("Redefini\xE7\xE3o de Senha", "Solicita\xE7\xE3o de nova senha de acesso", content, url, "Redefinir Senha")
  });
}

// server/routes/auth.ts
var authRouter = Router();
var loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Muitas tentativas de login. Tente novamente em 15 minutos." },
  skipSuccessfulRequests: true
});
var forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1e3,
  max: 5,
  message: { message: "Muitas solicita\xE7\xF5es. Tente novamente mais tarde." }
});
function issueToken(userId, role, email) {
  return jwt2.sign(
    { id: userId, role, email },
    process.env.JWT_SECRET,
    { expiresIn: "7d", algorithm: "HS256" }
  );
}
function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1e3,
    path: "/"
  });
}
authRouter.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      res.status(400).json({ message: "E-mail e senha s\xE3o obrigat\xF3rios." });
      return;
    }
    if (email.length > 255 || password.length > 256) {
      res.status(400).json({ message: "Dados inv\xE1lidos." });
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    const hashToCompare = user?.password ?? "$2a$12$invalidhashfortiminguniformity..padded";
    const valid = await bcrypt.compare(password, hashToCompare);
    if (!user || !valid) {
      res.status(401).json({ message: "E-mail ou senha inv\xE1lidos." });
      return;
    }
    if (user.status === "INATIVO") {
      res.status(403).json({ message: "Conta suspensa. Contate o administrador." });
      return;
    }
    const token = issueToken(user.id, user.role, user.email);
    setAuthCookie(res, token);
    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (e) {
    console.error("[auth/login]", e);
    res.status(500).json({ message: "Erro interno. Tente novamente." });
  }
});
authRouter.post("/logout", (_req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ success: true });
});
authRouter.get("/me", authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        locationIds: true,
        status: true,
        department: true,
        notes: true,
        createdAt: true
      }
    });
    if (!user || user.status === "INATIVO") {
      res.clearCookie("token", { path: "/" });
      res.status(401).json({ message: "Sess\xE3o inv\xE1lida." });
      return;
    }
    res.json(user);
  } catch {
    res.status(500).json({ message: "Erro interno." });
  }
});
authRouter.post("/forgot-password", forgotLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string" || email.length > 255) {
      res.status(400).json({ message: "E-mail inv\xE1lido." });
      return;
    }
    res.json({ success: true });
    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!user) return;
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true }
    });
    const token = crypto.randomBytes(48).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: crypto.createHash("sha256").update(token).digest("hex"),
        // store hashed
        expiresAt: new Date(Date.now() + 60 * 60 * 1e3)
      }
    });
    await sendPasswordResetEmail(user.email, user.name, token).catch(
      (e) => console.error("[forgot-password] email send failed:", e)
    );
  } catch (e) {
    console.error("[auth/forgot-password]", e);
  }
});
authRouter.post("/reset-password", rateLimit({ windowMs: 15 * 60 * 1e3, max: 10 }), async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password || password.length < 8 || password.length > 256) {
      res.status(400).json({ message: "Token inv\xE1lido ou senha muito curta (m\xEDnimo 8 caracteres)." });
      return;
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token: hashedToken } });
    if (!resetToken || resetToken.used || resetToken.expiresAt < /* @__PURE__ */ new Date()) {
      res.status(400).json({ message: "Link inv\xE1lido ou expirado. Solicite um novo." });
      return;
    }
    const hashed = await bcrypt.hash(password, 12);
    await prisma.$transaction([
      prisma.user.update({ where: { id: resetToken.userId }, data: { password: hashed } }),
      prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { used: true } })
    ]);
    res.json({ success: true });
  } catch (e) {
    console.error("[auth/reset-password]", e);
    res.status(500).json({ message: "Erro interno." });
  }
});

// server/routes/users.ts
import { Router as Router2 } from "express";
import bcrypt2 from "bcryptjs";
import crypto2 from "crypto";
var usersRouter = Router2();
usersRouter.use(authenticate);
var SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  locationIds: true,
  status: true,
  department: true,
  notes: true,
  createdAt: true,
  updatedAt: true
};
usersRouter.get("/", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({ select: SAFE_SELECT, orderBy: { name: "asc" } });
    res.json(users);
  } catch {
    res.status(500).json({ message: "Erro ao listar usu\xE1rios." });
  }
});
usersRouter.post("/", requireAdmin, async (req, res) => {
  try {
    const { name, email, role, locationIds, department, notes, status } = req.body;
    if (!name || !email) {
      res.status(400).json({ message: "Nome e e-mail s\xE3o obrigat\xF3rios." });
      return;
    }
    const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (exists) {
      res.status(409).json({ message: "E-mail j\xE1 cadastrado." });
      return;
    }
    const tempToken = crypto2.randomBytes(32).toString("hex");
    const tempPassword = await bcrypt2.hash(crypto2.randomBytes(16).toString("hex"), 10);
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: tempPassword,
        role: role || "VIEWER",
        locationIds: locationIds || ["ALL"],
        department,
        notes,
        status: status || "ATIVO"
      },
      select: SAFE_SELECT
    });
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: tempToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1e3)
        // 24h
      }
    });
    try {
      await sendPasswordSetupEmail(user.email, user.name, tempToken);
    } catch (e) {
      console.warn("Failed to send welcome email:", e);
    }
    res.status(201).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Erro ao criar usu\xE1rio." });
  }
});
usersRouter.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { name, email, role, locationIds, department, notes, status } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, email: email?.toLowerCase(), role, locationIds, department, notes, status },
      select: SAFE_SELECT
    });
    res.json(user);
  } catch {
    res.status(500).json({ message: "Erro ao atualizar usu\xE1rio." });
  }
});
usersRouter.delete("/:id", requireAdmin, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      res.status(400).json({ message: "Voc\xEA n\xE3o pode excluir sua pr\xF3pria conta." });
      return;
    }
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Erro ao excluir usu\xE1rio." });
  }
});
usersRouter.post("/:id/resend-password", requireAdmin, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) {
      res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado." });
      return;
    }
    const token = crypto2.randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1e3) }
    });
    await sendPasswordSetupEmail(user.email, user.name, token);
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Erro ao reenviar senha." });
  }
});

// server/routes/locations.ts
import { Router as Router3 } from "express";
var locationsRouter = Router3();
locationsRouter.use(authenticate);
locationsRouter.get("/", async (_req, res) => {
  try {
    const locations = await prisma.location.findMany({ orderBy: { name: "asc" } });
    res.json(locations);
  } catch {
    res.status(500).json({ message: "Erro ao listar almoxarifados." });
  }
});
locationsRouter.post("/", requireAdmin, async (req, res) => {
  try {
    const { name, code, address, description, responsibleName, responsibleContact } = req.body;
    if (!name || !code) {
      res.status(400).json({ message: "Nome e c\xF3digo s\xE3o obrigat\xF3rios." });
      return;
    }
    const location = await prisma.location.create({
      data: { name, code: code.toUpperCase(), address, description, responsibleName, responsibleContact }
    });
    res.status(201).json(location);
  } catch (e) {
    if (e.code === "P2002") {
      res.status(409).json({ message: "C\xF3digo de almoxarifado j\xE1 existe." });
      return;
    }
    res.status(500).json({ message: "Erro ao criar almoxarifado." });
  }
});
locationsRouter.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { name, code, address, description, responsibleName, responsibleContact } = req.body;
    const location = await prisma.location.update({
      where: { id: req.params.id },
      data: { name, code: code?.toUpperCase(), address, description, responsibleName, responsibleContact }
    });
    res.json(location);
  } catch {
    res.status(500).json({ message: "Erro ao atualizar almoxarifado." });
  }
});
locationsRouter.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const hasItems = await prisma.epiItem.count({ where: { locationId: req.params.id } });
    if (hasItems > 0) {
      res.status(400).json({ message: "N\xE3o \xE9 poss\xEDvel excluir: existem itens vinculados a este almoxarifado." });
      return;
    }
    await prisma.location.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Erro ao excluir almoxarifado." });
  }
});

// server/routes/items.ts
import { Router as Router4 } from "express";
var itemsRouter = Router4();
itemsRouter.use(authenticate);
itemsRouter.get("/", async (_req, res) => {
  try {
    const items2 = await prisma.epiItem.findMany({
      include: { stocks: true },
      orderBy: { name: "asc" }
    });
    res.json(items2);
  } catch {
    res.status(500).json({ message: "Erro ao listar itens." });
  }
});
itemsRouter.get("/:id", async (req, res) => {
  try {
    const item = await prisma.epiItem.findUnique({
      where: { id: req.params.id },
      include: { stocks: true }
    });
    if (!item) {
      res.status(404).json({ message: "Item n\xE3o encontrado." });
      return;
    }
    res.json(item);
  } catch {
    res.status(500).json({ message: "Erro ao buscar item." });
  }
});
itemsRouter.post("/", requireAdminOrController, async (req, res) => {
  try {
    const { name, type, caNumber, caExpiry, brand, category, protectionCategory, unit, imageUrl, description, stocks } = req.body;
    if (!name || !category || !unit) {
      res.status(400).json({ message: "Nome, categoria e unidade s\xE3o obrigat\xF3rios." });
      return;
    }
    const item = await prisma.epiItem.create({
      data: { name, type: type || "EPI", caNumber, caExpiry, brand, category, protectionCategory, unit, imageUrl, description }
    });
    if (stocks && Array.isArray(stocks)) {
      for (const stock of stocks) {
        if (stock.locationId) {
          const qty = Number(stock.quantity) || 0;
          await prisma.itemStock.create({
            data: {
              itemId: item.id,
              locationId: stock.locationId,
              quantity: qty,
              minQuantity: Number(stock.minQuantity) || 0
            }
          });
          if (qty > 0) {
            const location = await prisma.location.findUnique({ where: { id: stock.locationId } });
            await prisma.stockMovement.create({
              data: {
                type: "INICIAL",
                quantity: qty,
                previousQuantity: 0,
                newQuantity: qty,
                itemId: item.id,
                itemName: item.name,
                locationId: stock.locationId,
                locationName: location?.name || stock.locationId,
                reason: "Cadastro inicial do item"
              }
            });
          }
        }
      }
    }
    const itemWithStocks = await prisma.epiItem.findUnique({ where: { id: item.id }, include: { stocks: true } });
    res.status(201).json(itemWithStocks);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Erro ao criar item." });
  }
});
itemsRouter.put("/:id", requireAdminOrController, async (req, res) => {
  try {
    const { name, type, caNumber, caExpiry, brand, category, protectionCategory, unit, imageUrl, description, stocks } = req.body;
    const itemId = req.params.id;
    const updated = await prisma.epiItem.update({
      where: { id: itemId },
      data: { name, type, caNumber, caExpiry, brand, category, protectionCategory, unit, imageUrl, description }
    });
    if (stocks && Array.isArray(stocks)) {
      for (const stock of stocks) {
        if (stock.locationId) {
          await prisma.itemStock.upsert({
            where: {
              itemId_locationId: {
                itemId,
                locationId: stock.locationId
              }
            },
            update: {
              minQuantity: Number(stock.minQuantity) || 0
              // we don't update quantity directly via PUT to avoid bypassing stock movements
            },
            create: {
              itemId,
              locationId: stock.locationId,
              quantity: 0,
              // must use movements to add quantity
              minQuantity: Number(stock.minQuantity) || 0
            }
          });
        }
      }
    }
    const itemWithStocks = await prisma.epiItem.findUnique({ where: { id: itemId }, include: { stocks: true } });
    res.json(itemWithStocks);
  } catch (e) {
    console.error("Error updating item:", e);
    res.status(500).json({ message: "Erro ao atualizar item." });
  }
});
itemsRouter.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const itemId = req.params.id;
    await prisma.stockMovement.deleteMany({ where: { itemId } });
    await prisma.itemStock.deleteMany({ where: { itemId } });
    await prisma.epiItem.delete({ where: { id: itemId } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Erro ao excluir item." });
  }
});

// server/routes/kits.ts
import { Router as Router5 } from "express";
var kitsRouter = Router5();
kitsRouter.use(authenticate);
function parseQty(c) {
  const val = c.quantity ?? c.requiredQuantity;
  if (val === void 0 || val === null) return 1;
  const num = parseInt(String(val), 10);
  return isNaN(num) || num < 1 ? 1 : num;
}
kitsRouter.get("/", async (_req, res) => {
  try {
    const kits = await prisma.epiKit.findMany({
      include: { components: true },
      orderBy: { createdAt: "desc" }
    });
    res.json(kits);
  } catch (e) {
    console.error("Error listing kits:", e);
    res.status(500).json({ message: "Erro ao listar kits." });
  }
});
kitsRouter.post("/", requireAdminOrController, async (req, res) => {
  try {
    const { name, description, type, imageUrl, components } = req.body;
    if (!name || !components?.length) {
      res.status(400).json({ message: "Nome e componentes s\xE3o obrigat\xF3rios." });
      return;
    }
    const kit = await prisma.epiKit.create({
      data: {
        name: String(name).trim(),
        description: description ? String(description).trim() : "",
        type: type || "EPI_EPC",
        imageUrl: imageUrl || "",
        components: {
          create: components.map((c) => ({
            itemId: String(c.itemId || ""),
            itemName: String(c.itemName || "Item"),
            quantity: parseQty(c)
          }))
        }
      },
      include: { components: true }
    });
    res.json(kit);
  } catch (e) {
    console.error("Error creating kit:", e);
    res.status(500).json({ message: "Erro ao criar kit." });
  }
});
kitsRouter.put("/:id", requireAdminOrController, async (req, res) => {
  try {
    const { name, description, type, imageUrl, components } = req.body;
    await prisma.kitComponent.deleteMany({ where: { kitId: req.params.id } });
    const kit = await prisma.epiKit.update({
      where: { id: req.params.id },
      data: {
        name: String(name).trim(),
        description: description ? String(description).trim() : "",
        type,
        imageUrl: imageUrl || "",
        components: {
          create: components?.map((c) => ({
            itemId: String(c.itemId || ""),
            itemName: String(c.itemName || "Item"),
            quantity: parseQty(c)
          })) || []
        }
      },
      include: { components: true }
    });
    res.json(kit);
  } catch (e) {
    console.error("Error updating kit:", e);
    res.status(500).json({ message: "Erro ao atualizar kit." });
  }
});
kitsRouter.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await prisma.epiKit.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) {
    console.error("Error deleting kit:", e);
    res.status(500).json({ message: "Erro ao excluir kit." });
  }
});

// server/routes/movements.ts
import { Router as Router6 } from "express";
var movementsRouter = Router6();
movementsRouter.use(authenticate);
async function getOrCreateItemStock(tx, itemId, locationId) {
  const stock = await tx.itemStock.findUnique({
    where: { itemId_locationId: { itemId, locationId } }
  });
  if (stock) return stock;
  const newItemStock = await tx.itemStock.create({
    data: {
      itemId,
      locationId,
      quantity: 0,
      minQuantity: 0
    }
  });
  return newItemStock;
}
movementsRouter.get("/", async (_req, res) => {
  try {
    const movs = await prisma.stockMovement.findMany({
      orderBy: { createdAt: "desc" },
      take: 1500
    });
    res.json(movs);
  } catch {
    res.status(500).json({ message: "Erro ao listar movimenta\xE7\xF5es." });
  }
});
movementsRouter.post("/single", async (req, res) => {
  try {
    const { itemId, type, quantity, reason, employeeName, employeeRole, employeeRegistration, notes } = req.body;
    const { locationId } = req.body;
    if (!locationId) {
      return res.status(400).json({ message: "Obrigat\xF3rio informar a localidade (locationId)." });
    }
    const qty = Number(quantity);
    if (qty <= 0) return res.status(400).json({ message: "Quantidade deve ser maior que zero." });
    await prisma.$transaction(async (tx) => {
      const item = await tx.epiItem.findUnique({ where: { id: itemId } });
      if (!item) throw new Error("Item n\xE3o encontrado.");
      const location = await tx.location.findUnique({ where: { id: locationId } });
      if (!location) throw new Error("Localidade n\xE3o encontrada.");
      const stock = await getOrCreateItemStock(tx, itemId, locationId);
      const prev = stock.quantity;
      let newQty = prev;
      if (type === "SAIDA") {
        if (prev < qty) throw new Error(`Saldo insuficiente. Saldo atual: ${prev}`);
        newQty = prev - qty;
      } else if (type === "ENTRADA") {
        newQty = prev + qty;
      }
      await tx.itemStock.update({ where: { id: stock.id }, data: { quantity: newQty } });
      await tx.stockMovement.create({
        data: {
          type,
          quantity: qty,
          previousQuantity: prev,
          newQuantity: newQty,
          itemId: item.id,
          itemName: item.name,
          locationId,
          locationName: location.name,
          employeeName,
          employeeRole,
          employeeRegistration,
          reason,
          notes,
          userId: req.user.id
        }
      });
    });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ message: e.message || "Erro ao registrar movimenta\xE7\xE3o." });
  }
});
movementsRouter.post("/batch", async (req, res) => {
  try {
    const { locationId, entries, reason, employeeName, employeeRole, employeeRegistration, isDailyClosing, notes, customDate } = req.body;
    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ message: "Lote vazio." });
    }
    let count = 0;
    await prisma.$transaction(async (tx) => {
      const location = await tx.location.findUnique({ where: { id: locationId } });
      if (!location) throw new Error("Localidade n\xE3o encontrada.");
      for (const entry of entries) {
        const item = await tx.epiItem.findUnique({ where: { id: entry.itemId } });
        if (!item) continue;
        const stock = await getOrCreateItemStock(tx, item.id, locationId);
        const type = entry.type;
        const eQty = Number(entry.quantity);
        let qtyToMove = eQty;
        const prev = stock.quantity;
        let newQty = prev;
        if (type === "AJUSTE") {
          newQty = Number(entry.newQuantity);
          qtyToMove = Math.abs(newQty - prev);
          if (qtyToMove === 0) continue;
        } else if (type === "SAIDA") {
          if (prev < eQty) throw new Error(`Saldo insuficiente para "${item.name}".`);
          newQty = prev - eQty;
        } else if (type === "ENTRADA") {
          newQty = prev + eQty;
        }
        await tx.itemStock.update({ where: { id: stock.id }, data: { quantity: newQty } });
        const createdAt = customDate ? new Date(customDate) : /* @__PURE__ */ new Date();
        await tx.stockMovement.create({
          data: {
            type,
            quantity: qtyToMove,
            previousQuantity: prev,
            newQuantity: newQty,
            itemId: item.id,
            itemName: item.name,
            locationId,
            locationName: location.name,
            employeeName,
            employeeRole,
            employeeRegistration,
            reason,
            notes: entry.notes || notes,
            userId: req.user.id,
            createdAt
          }
        });
        count++;
      }
    });
    res.json({ success: true, count });
  } catch (e) {
    res.status(400).json({ message: e.message || "Erro ao registrar lote." });
  }
});
movementsRouter.post("/transfer", async (req, res) => {
  try {
    const { sourceItemId, targetLocationId, quantity, reason, employeeName, notes } = req.body;
    const qty = Number(quantity);
    if (qty <= 0) return res.status(400).json({ message: "Quantidade inv\xE1lida." });
    const { sourceLocationId } = req.body;
    if (!sourceLocationId) return res.status(400).json({ message: "Obrigat\xF3rio informar sourceLocationId." });
    await prisma.$transaction(async (tx) => {
      const item = await tx.epiItem.findUnique({ where: { id: sourceItemId } });
      if (!item) throw new Error("Item origem n\xE3o encontrado.");
      const sourceStock = await getOrCreateItemStock(tx, sourceItemId, sourceLocationId);
      const targetStock = await getOrCreateItemStock(tx, sourceItemId, targetLocationId);
      const sourceLocation = await tx.location.findUnique({ where: { id: sourceLocationId } });
      const targetLocation = await tx.location.findUnique({ where: { id: targetLocationId } });
      if (sourceStock.quantity < qty) throw new Error("Saldo insuficiente na origem.");
      const srcPrev = sourceStock.quantity;
      const srcNew = srcPrev - qty;
      await tx.itemStock.update({ where: { id: sourceStock.id }, data: { quantity: srcNew } });
      await tx.stockMovement.create({
        data: {
          type: "TRANSFERENCIA_SAIDA",
          quantity: qty,
          previousQuantity: srcPrev,
          newQuantity: srcNew,
          itemId: item.id,
          itemName: item.name,
          locationId: sourceLocationId,
          locationName: sourceLocation.name,
          employeeName,
          reason: `Transfer\xEAncia para ${targetLocation.name}`,
          notes,
          userId: req.user.id
        }
      });
      const tgtPrev = targetStock.quantity;
      const tgtNew = tgtPrev + qty;
      await tx.itemStock.update({ where: { id: targetStock.id }, data: { quantity: tgtNew } });
      await tx.stockMovement.create({
        data: {
          type: "TRANSFERENCIA_ENTRADA",
          quantity: qty,
          previousQuantity: tgtPrev,
          newQuantity: tgtNew,
          itemId: item.id,
          itemName: item.name,
          locationId: targetLocationId,
          locationName: targetLocation.name,
          employeeName,
          reason: `Transfer\xEAncia de ${sourceLocation.name}`,
          notes,
          userId: req.user.id
        }
      });
    });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ message: e.message || "Erro na transfer\xEAncia." });
  }
});
movementsRouter.post("/adjust", async (req, res) => {
  try {
    const { itemId, locationId, newQuantity, reason, notes } = req.body;
    if (newQuantity < 0) return res.status(400).json({ message: "Quantidade inv\xE1lida." });
    await prisma.$transaction(async (tx) => {
      const item = await tx.epiItem.findUnique({ where: { id: itemId } });
      if (!item) throw new Error("Item n\xE3o encontrado.");
      const location = await tx.location.findUnique({ where: { id: locationId } });
      const stock = await getOrCreateItemStock(tx, itemId, locationId);
      const prev = stock.quantity;
      const diff = Math.abs(newQuantity - prev);
      if (diff === 0) return;
      await tx.itemStock.update({ where: { id: stock.id }, data: { quantity: newQuantity } });
      await tx.stockMovement.create({
        data: {
          type: "AJUSTE",
          quantity: diff,
          previousQuantity: prev,
          newQuantity,
          itemId: item.id,
          itemName: item.name,
          locationId,
          locationName: location.name,
          reason,
          notes,
          userId: req.user.id
        }
      });
    });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ message: e.message || "Erro no ajuste." });
  }
});
movementsRouter.post("/deliver-kit", async (req, res) => {
  try {
    const { kitId, locationId, quantityOfKits, employeeName, employeeRole, employeeRegistration, notes } = req.body;
    await prisma.$transaction(async (tx) => {
      const kit = await tx.epiKit.findUnique({
        where: { id: kitId },
        include: { components: true }
      });
      if (!kit) throw new Error("Kit n\xE3o encontrado.");
      const location = await tx.location.findUnique({ where: { id: locationId } });
      for (const comp of kit.components) {
        const item = await tx.epiItem.findUnique({ where: { id: comp.itemId } });
        if (!item) continue;
        const stock = await getOrCreateItemStock(tx, comp.itemId, locationId);
        const deduct = comp.quantity * quantityOfKits;
        const prev = stock.quantity;
        const newQty = prev - deduct;
        await tx.itemStock.update({ where: { id: stock.id }, data: { quantity: newQty } });
        await tx.stockMovement.create({
          data: {
            type: "ENTREGA_KIT",
            quantity: deduct,
            previousQuantity: prev,
            newQuantity: newQty,
            itemId: item.id,
            itemName: item.name,
            locationId,
            locationName: location.name,
            employeeName,
            employeeRole,
            employeeRegistration,
            reason: `Entrega de Kit: ${kit.name} (${quantityOfKits}x)`,
            notes,
            userId: req.user.id
          }
        });
      }
    });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ message: e.message || "Erro ao entregar kit." });
  }
});

// server/routes/upload.ts
import { Router as Router7 } from "express";
import multer from "multer";
import path from "path";

// server/lib/s3.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
var s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || "eu-east-1",
  credentials: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET
  },
  forcePathStyle: true
});
async function uploadToS3(bucket, key, body, contentType) {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: "public-read"
    })
  );
  const endpoint = process.env.S3_ENDPOINT.replace(/\/$/, "");
  return `${endpoint}/${bucket}/${key}`;
}
var BUCKETS = {
  items: process.env.S3_BUCKET || "estoque-epi",
  ergonomicos: process.env.S3_BUCKET_ERGONOMICOS || "estoque-ergonomicos",
  fotos: process.env.S3_BUCKET_FOTOS || "estoque-usuarios"
};

// server/routes/upload.ts
var uploadRouter = Router7();
uploadRouter.use(authenticate, requireAdminOrController);
var upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  }
});
uploadRouter.post("/item", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Arquivo n\xE3o enviado." });
      return;
    }
    const { itemType } = req.body;
    const bucket = itemType === "ERGONOMICO" ? BUCKETS.ergonomicos : BUCKETS.items;
    const key = `${Date.now()}-${req.file.originalname.replace(/\s/g, "_")}`;
    const url = await uploadToS3(bucket, key, req.file.buffer, req.file.mimetype);
    res.json({ url });
  } catch (e) {
    console.error("Upload error:", e);
    res.status(500).json({ message: "Erro ao fazer upload da imagem." });
  }
});
uploadRouter.post("/user-photo", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Arquivo n\xE3o enviado." });
      return;
    }
    const key = `${Date.now()}-${req.file.originalname.replace(/\s/g, "_")}`;
    const url = await uploadToS3(BUCKETS.fotos, key, req.file.buffer, req.file.mimetype);
    res.json({ url });
  } catch (e) {
    console.error("Upload error:", e);
    res.status(500).json({ message: "Erro ao fazer upload da foto." });
  }
});

// server/routes/sharepoint.ts
import { Router as Router8 } from "express";
var sharepointRouter = Router8();
var WEBHOOK_SECRET = process.env.SHAREPOINT_WEBHOOK_SECRET;
function verifySecret(req, res) {
  if (!WEBHOOK_SECRET) {
    res.status(500).json({ message: "SHAREPOINT_WEBHOOK_SECRET n\xE3o configurado no servidor." });
    return false;
  }
  const auth = req.headers["authorization"];
  if (auth !== `Bearer ${WEBHOOK_SECRET}`) {
    res.status(401).json({ message: "N\xE3o autorizado. Token inv\xE1lido ou ausente." });
    return false;
  }
  return true;
}
function normalize(text) {
  return text.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, " ");
}
async function logSync(direction, summary) {
  console.log(`[SharePoint ${direction}]`, JSON.stringify(summary));
}
sharepointRouter.get("/status", authenticate, async (_req, res) => {
  try {
    const paWebhookUrl = process.env.POWER_AUTOMATE_WEBHOOK_URL;
    const paWebhookPullUrl = process.env.POWER_AUTOMATE_WEBHOOK_PULL_URL;
    const secretConfigured = !!WEBHOOK_SECRET;
    const webhookConfigured = !!paWebhookUrl;
    const webhookPullConfigured = !!paWebhookPullUrl;
    const spoLocations = await prisma.location.findMany({
      where: { code: { startsWith: "SPO-" } },
      orderBy: { name: "asc" }
    });
    res.json({
      integration: {
        secretConfigured,
        webhookConfigured,
        webhookPullConfigured,
        ready: secretConfigured && (webhookConfigured || webhookPullConfigured)
      },
      spoLocations: spoLocations.map((l) => ({
        id: l.id,
        name: l.name,
        code: l.code,
        responsibleName: l.responsibleName
      }))
    });
  } catch (e) {
    console.error("[sharepoint/status]", e);
    res.status(500).json({ message: "Erro ao verificar status." });
  }
});
sharepointRouter.post("/sync", authenticate, requireAdmin, async (req, res) => {
  try {
    const paWebhookUrl = process.env.POWER_AUTOMATE_WEBHOOK_URL;
    if (!paWebhookUrl) {
      res.status(500).json({
        message: "POWER_AUTOMATE_WEBHOOK_URL n\xE3o configurada. Adicione ao .env."
      });
      return;
    }
    const { locationCodes } = req.body;
    const whereClause = locationCodes?.length ? { code: { in: locationCodes } } : { code: { startsWith: "SPO-" } };
    const locations = await prisma.location.findMany({ where: whereClause });
    if (!locations.length) {
      res.status(404).json({
        message: 'Nenhuma location SPO encontrada. Verifique os codes (devem come\xE7ar com "SPO-").'
      });
      return;
    }
    const results = [];
    for (const loc of locations) {
      const stocks = await prisma.itemStock.findMany({
        where: { locationId: loc.id },
        include: { item: true }
      });
      const colName = loc.code.replace(/^SPO-/, "").replace(/-/g, " ");
      const payload = {
        sheet: "ESTOQUE - SPO",
        // Nome da coluna na planilha — o Office Script usará para localizar a coluna
        location: colName,
        // Data da última contagem no app (para escrever na linha 5)
        lastInventoryDate: (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        }),
        items: stocks.map((s) => ({
          descricao: s.item.name,
          // Tamanho/variante fica em `description` no modelo atual
          tamanho: s.item.description || "UN",
          quantidade: s.quantity
        })),
        syncedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      try {
        const paRes = await fetch(paWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(3e4)
          // 30s timeout
        });
        const paText = await paRes.text();
        console.log(`[sharepoint/sync] Resposta do PA para ${loc.name}:`, paText);
        let paBody = null;
        try {
          paBody = JSON.parse(paText);
        } catch (e) {
        }
        results.push({ location: loc.name, sent: items.length, paStatus: paRes.status, paResponse: paBody });
      } catch (fetchErr) {
        console.error(`[sharepoint/sync] Erro enviando ${loc.name}:`, fetchErr);
        results.push({ location: loc.name, sent: 0, paStatus: -1 });
      }
    }
    await logSync("PUSH", { locations: results });
    res.json({
      success: true,
      syncedLocations: results.length,
      results
    });
  } catch (e) {
    console.error("[sharepoint/sync]", e);
    res.status(500).json({ message: "Erro ao sincronizar com SharePoint." });
  }
});
function fuzzyMatch(dbName, sheetName) {
  const clean = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/\b(UN|PAR|PCT|CX|ROLO)\b/gi, "").replace(/[-()]/g, " ").replace(/\s+/g, " ").trim();
  const normDb = clean(dbName);
  const normSheet = clean(sheetName);
  if (normDb === normSheet) return true;
  if (normDb.includes(normSheet) || normSheet.includes(normDb)) return true;
  const numDb = normDb.match(/\d+/g)?.join(",") || "";
  const numSheet = normSheet.match(/\d+/g)?.join(",") || "";
  if (numDb && numSheet && numDb !== numSheet) {
    return false;
  }
  const wordsDb = normDb.split(" ").filter((w) => w.length > 2 || /\d/.test(w));
  const wordsSheet = normSheet.split(" ").filter((w) => w.length > 2 || /\d/.test(w));
  let matches = 0;
  for (const w of wordsDb) {
    if (wordsSheet.some((ws) => ws === w || ws.startsWith(w) || w.startsWith(ws))) {
      matches++;
    }
  }
  const ratio = matches / Math.max(wordsDb.length, wordsSheet.length);
  return ratio >= 0.8;
}
sharepointRouter.post("/pull", authenticate, requireAdmin, async (_req, res) => {
  try {
    const paUrl = process.env.POWER_AUTOMATE_WEBHOOK_PULL_URL;
    if (!paUrl) {
      res.status(500).json({
        message: "POWER_AUTOMATE_WEBHOOK_PULL_URL n\xE3o configurada. Adicione ao .env do CapRover."
      });
      return;
    }
    let paData;
    try {
      const paRes = await fetch(paUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trigger: "pull", requestedAt: (/* @__PURE__ */ new Date()).toISOString() }),
        signal: AbortSignal.timeout(6e4)
        // 60s — scripts podem demorar
      });
      if (!paRes.ok) {
        const errText = await paRes.text().catch(() => `HTTP ${paRes.status}`);
        res.status(502).json({
          message: `Power Automate retornou erro ${paRes.status}: ${errText}`
        });
        return;
      }
      paData = await paRes.json();
    } catch (fetchErr) {
      const isTimeout = fetchErr?.name === "TimeoutError" || fetchErr?.name === "AbortError";
      res.status(502).json({
        message: isTimeout ? "Timeout ao aguardar resposta do Power Automate (>60s). Tente novamente." : `Erro de rede ao chamar Power Automate: ${fetchErr?.message}`
      });
      return;
    }
    const payload = paData?.locations ? paData : paData?.result?.locations ? paData.result : null;
    if (!payload?.locations || !Array.isArray(payload.locations)) {
      console.error("[sharepoint/pull] Payload inesperado do PA:", JSON.stringify(paData).slice(0, 500));
      res.status(502).json({
        message: "Resposta do Power Automate n\xE3o tem o formato esperado. Verifique o Office Script.",
        received: paData
      });
      return;
    }
    const summary = [];
    const syncedAt = payload.syncedAt ?? (/* @__PURE__ */ new Date()).toISOString();
    for (const locPayload of payload.locations) {
      const derivedCode = `SPO-${locPayload.location.replace(/\s+/g, "-").toUpperCase()}`;
      const codeToSearch = locPayload.locationCode || derivedCode;
      const dbLocation = await prisma.location.findUnique({ where: { code: codeToSearch } });
      if (!dbLocation) {
        summary.push({
          location: locPayload.location,
          matched: 0,
          updated: 0,
          skipped: 0,
          notFound: [`Location com code "${codeToSearch}" n\xE3o cadastrada no app.`]
        });
        continue;
      }
      const dbStocks = await prisma.itemStock.findMany({
        where: { locationId: dbLocation.id },
        include: { item: true }
      });
      let matched = 0, updated = 0, skipped = 0, zeroed = 0;
      const notFound = [];
      const matchedDbStockIds = /* @__PURE__ */ new Set();
      for (const spItem of locPayload.items) {
        if (!spItem.descricao) continue;
        const spNorm = normalize(spItem.descricao);
        const spTam = normalize(spItem.tamanho || "");
        let dbStock = dbStocks.find((s) => normalize(s.item.name) === spNorm);
        if (!dbStock && spTam && spTam !== "UN") {
          dbStock = dbStocks.find((s) => normalize(s.item.name) === `${spNorm} ${spTam}`);
        }
        if (!dbStock) {
          dbStock = dbStocks.find((s) => fuzzyMatch(s.item.name, `${spItem.descricao} ${spItem.tamanho || ""}`));
        }
        if (!dbStock) {
          const allItems = await prisma.epiItem.findMany();
          let dbItem2 = allItems.find((i) => normalize(i.name) === spNorm || normalize(i.name) === `${spNorm} ${spTam}` || fuzzyMatch(i.name, `${spItem.descricao} ${spItem.tamanho || ""}`));
          if (dbItem2) {
            dbStock = await prisma.itemStock.create({
              data: { itemId: dbItem2.id, locationId: dbLocation.id, quantity: 0, minQuantity: 0 },
              include: { item: true }
            });
            dbStocks.push(dbStock);
          } else {
            const newItemName = `${spItem.descricao}${spItem.tamanho && spItem.tamanho !== "UN" ? ` - Tam ${spItem.tamanho}` : ""}`;
            dbItem2 = await prisma.epiItem.create({
              data: {
                name: newItemName.substring(0, 100),
                description: spItem.tamanho && spItem.tamanho !== "UN" ? `Tam ${spItem.tamanho}` : null,
                category: "Importado Planilha",
                type: "EPI",
                unit: "un"
              }
            });
            dbStock = await prisma.itemStock.create({
              data: { itemId: dbItem2.id, locationId: dbLocation.id, quantity: 0, minQuantity: 0 },
              include: { item: true }
            });
            dbStocks.push(dbStock);
          }
        }
        if (!dbStock) {
          notFound.push(`${spItem.descricao}${spItem.tamanho && spItem.tamanho !== "UN" ? ` (${spItem.tamanho})` : ""}`);
          continue;
        }
        matched++;
        matchedDbStockIds.add(dbStock.id);
        if (dbStock.quantity === spItem.quantidade) {
          skipped++;
          continue;
        }
        const prev = dbStock.quantity;
        const next = spItem.quantidade;
        await prisma.itemStock.update({ where: { id: dbStock.id }, data: { quantity: next } });
        const dbItem = dbStock.item;
        await prisma.stockMovement.create({
          data: {
            type: "AJUSTE",
            quantity: Math.abs(next - prev),
            previousQuantity: prev,
            newQuantity: next,
            itemId: dbItem.id,
            itemName: dbItem.name,
            locationId: dbLocation.id,
            locationName: dbLocation.name,
            reason: `Sincroniza\xE7\xE3o autom\xE1tica via SharePoint \u2014 ${syncedAt}`,
            notes: `Fonte: Planilha ESTOQUE - SPO | Coluna: ${locPayload.location}`
          }
        });
        updated++;
      }
      for (const stock of dbStocks) {
        if (!matchedDbStockIds.has(stock.id)) {
          await prisma.itemStock.delete({ where: { id: stock.id } });
          zeroed++;
          updated++;
        }
      }
      summary.push({ location: locPayload.location, matched, updated, skipped, notFound });
    }
    await logSync("PULL", { syncedAt, summary });
    res.json({
      success: true,
      totalUpdated: summary.reduce((a, s) => a + s.updated, 0),
      totalMatched: summary.reduce((a, s) => a + s.matched, 0),
      summary
    });
  } catch (e) {
    console.error("[sharepoint/pull]", e);
    res.status(500).json({ message: "Erro interno ao processar pull do SharePoint." });
  }
});
sharepointRouter.post("/ingest", async (req, res) => {
  if (!verifySecret(req, res)) return;
  try {
    const { locations, syncedAt } = req.body;
    if (!Array.isArray(locations) || !locations.length) {
      res.status(400).json({ message: 'Payload inv\xE1lido: "locations" deve ser um array n\xE3o vazio.' });
      return;
    }
    const summary = [];
    for (const locPayload of locations) {
      const derivedCode = `SPO-${locPayload.location.replace(/\s+/g, "-").toUpperCase()}`;
      const codeToSearch = locPayload.locationCode || derivedCode;
      const dbLocation = await prisma.location.findUnique({ where: { code: codeToSearch } });
      if (!dbLocation) {
        summary.push({ location: locPayload.location, matched: 0, updated: 0, skipped: 0, notFound: [`"${codeToSearch}" n\xE3o encontrada`] });
        continue;
      }
      const dbItems = await prisma.epiItem.findMany({ where: { locationId: dbLocation.id } });
      let matched = 0, updated = 0, skipped = 0;
      const notFound = [];
      for (const spItem of locPayload.items) {
        if (!spItem.descricao) continue;
        const spNorm = normalize(spItem.descricao);
        let dbItem = dbItems.find((i) => normalize(i.name) === spNorm) ?? dbItems.find((i) => normalize(i.name).includes(spNorm) || spNorm.includes(normalize(i.name)));
        if (!dbItem) {
          notFound.push(spItem.descricao);
          continue;
        }
        matched++;
        if (dbItem.quantity === spItem.quantidade) {
          skipped++;
          continue;
        }
        const prev = dbItem.quantity;
        await prisma.epiItem.update({ where: { id: dbItem.id }, data: { quantity: spItem.quantidade } });
        await prisma.stockMovement.create({
          data: {
            type: "AJUSTE",
            quantity: Math.abs(spItem.quantidade - prev),
            previousQuantity: prev,
            newQuantity: spItem.quantidade,
            itemId: dbItem.id,
            itemName: dbItem.name,
            locationId: dbLocation.id,
            locationName: dbLocation.name,
            reason: `Sincroniza\xE7\xE3o SharePoint (ingest) \u2014 ${syncedAt ?? (/* @__PURE__ */ new Date()).toISOString()}`,
            notes: `Planilha: ESTOQUE - SPO | Coluna: ${locPayload.location}`
          }
        });
        updated++;
      }
      summary.push({ location: locPayload.location, matched, updated, skipped, notFound });
    }
    await logSync("PULL", { syncedAt, summary });
    res.json({ success: true, totalUpdated: summary.reduce((a, s) => a + s.updated, 0), summary });
  } catch (e) {
    console.error("[sharepoint/ingest]", e);
    res.status(500).json({ message: "Erro ao processar ingest do SharePoint." });
  }
});
sharepointRouter.post("/ingest", async (req, res) => {
  if (!verifySecret(req, res)) return;
  try {
    const { locations, syncedAt } = req.body;
    if (!Array.isArray(locations) || !locations.length) {
      res.status(400).json({ message: 'Payload inv\xE1lido: "locations" deve ser um array n\xE3o vazio.' });
      return;
    }
    const summary = [];
    for (const locPayload of locations) {
      const derivedCode = `SPO-${locPayload.location.replace(/\s+/g, "-").toUpperCase()}`;
      const codeToSearch = locPayload.locationCode || derivedCode;
      const dbLocation = await prisma.location.findUnique({ where: { code: codeToSearch } });
      if (!dbLocation) {
        summary.push({
          location: locPayload.location,
          matched: 0,
          updated: 0,
          skipped: 0,
          notFound: [`Location com code "${codeToSearch}" n\xE3o encontrada no banco.`]
        });
        continue;
      }
      const dbStocks = await prisma.itemStock.findMany({
        where: { locationId: dbLocation.id },
        include: { item: true }
      });
      let matched = 0;
      let updated = 0;
      let skipped = 0;
      const notFound = [];
      for (const spItem of locPayload.items) {
        if (!spItem.descricao) continue;
        const spNorm = normalize(spItem.descricao);
        const spTam = normalize(spItem.tamanho || "");
        let dbStock = dbStocks.find((s) => normalize(s.item.name) === spNorm);
        if (!dbStock && spTam && spTam !== "UN") {
          dbStock = dbStocks.find((s) => normalize(s.item.name) === `${spNorm} ${spTam}`);
        }
        if (!dbStock) {
          dbStock = dbStocks.find((s) => normalize(s.item.name).includes(spNorm) || spNorm.includes(normalize(s.item.name)));
        }
        if (!dbStock) {
          const allItems = await prisma.epiItem.findMany();
          let dbItem2 = allItems.find((i) => normalize(i.name) === spNorm || normalize(i.name) === `${spNorm} ${spTam}` || normalize(i.name).includes(spNorm) || spNorm.includes(normalize(i.name)));
          if (dbItem2) {
            dbStock = await prisma.itemStock.create({
              data: { itemId: dbItem2.id, locationId: dbLocation.id, quantity: 0, minQuantity: 0 },
              include: { item: true }
            });
            dbStocks.push(dbStock);
          }
        }
        if (!dbStock) {
          notFound.push(`${spItem.descricao}${spItem.tamanho ? ` (${spItem.tamanho})` : ""}`);
          continue;
        }
        matched++;
        if (dbStock.quantity === spItem.quantidade) {
          skipped++;
          continue;
        }
        const prev = dbStock.quantity;
        const next = spItem.quantidade;
        await prisma.itemStock.update({
          where: { id: dbStock.id },
          data: { quantity: next }
        });
        const dbItem = dbStock.item;
        await prisma.stockMovement.create({
          data: {
            type: "AJUSTE",
            quantity: Math.abs(next - prev),
            previousQuantity: prev,
            newQuantity: next,
            itemId: dbItem.id,
            itemName: dbItem.name,
            locationId: dbLocation.id,
            locationName: dbLocation.name,
            reason: `Sincroniza\xE7\xE3o autom\xE1tica via SharePoint \u2014 ${syncedAt ?? (/* @__PURE__ */ new Date()).toISOString()}`,
            notes: `Fonte: Planilha ESTOQUE - SPO | Coluna: ${locPayload.location}`
          }
        });
        updated++;
      }
      summary.push({ location: locPayload.location, matched, updated, skipped, notFound });
    }
    await logSync("PULL", { syncedAt, summary });
    const totalUpdated = summary.reduce((a, s) => a + s.updated, 0);
    res.json({
      success: true,
      totalUpdated,
      summary
    });
  } catch (e) {
    console.error("[sharepoint/ingest]", e);
    res.status(500).json({ message: "Erro ao processar dados do SharePoint." });
  }
});

// server/index.ts
var REQUIRED_ENV = ["DATABASE_URL", "JWT_SECRET", "NEXTAUTH_URL"];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`\u274C Missing required env var: ${key}`);
    process.exit(1);
  }
}
if (process.env.JWT_SECRET.length < 32) {
  console.error("\u274C JWT_SECRET must be at least 32 characters.");
  process.exit(1);
}
var __dirname = path2.dirname(fileURLToPath(import.meta.url));
var app = express();
var PORT = parseInt(process.env.PORT || "3001", 10);
var isProd = process.env.NODE_ENV === "production";
var ALLOWED_ORIGIN = isProd ? process.env.NEXTAUTH_URL : "http://localhost:3000";
app.set("trust proxy", 1);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    hsts: isProd ? { maxAge: 31536e3, includeSubDomains: true, preload: true } : false,
    xFrameOptions: { action: "deny" },
    noSniff: true
  })
);
app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  })
);
app.use(
  "/api/",
  rateLimit2({
    windowMs: 60 * 1e3,
    // 1 minute
    max: 200,
    // 200 req/min per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Muitas requisi\xE7\xF5es. Aguarde um momento." }
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.disable("x-powered-by");
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/locations", locationsRouter);
app.use("/api/items", itemsRouter);
app.use("/api/kits", kitsRouter);
app.use("/api/movements", movementsRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/sharepoint", sharepointRouter);
app.get(
  "/api/health",
  (_req, res) => res.json({ status: "ok", ts: (/* @__PURE__ */ new Date()).toISOString() })
);
if (isProd) {
  const distPath = path2.join(__dirname, "..", "dist");
  app.use(express.static(distPath, { index: false }));
  app.get("*", (_req, res) => res.sendFile(path2.join(distPath, "index.html")));
}
app.use((err, _req, res, _next) => {
  console.error("[unhandled error]", err);
  res.status(500).json({ message: "Erro interno do servidor." });
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`\u{1F680} EstoqueEPI [${isProd ? "PROD" : "DEV"}] \u2192 http://0.0.0.0:${PORT}`);
});
