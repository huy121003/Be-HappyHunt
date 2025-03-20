/**
 * Kết quả đánh giá ảnh
 * @typedef {Object} EvaluationResult
 * @property {boolean} approved - Ảnh có được duyệt hay không
 * @property {string[]} reasons - Lý do từ chối nếu có (gộp theo loại nội dung)
 */

/**
 * Ngưỡng tùy chỉnh cho các loại nội dung
 * @typedef {Object} Thresholds
 * @property {number} [nudity] - Ngưỡng cho nudity chính
 * @property {number} [nuditySuggestive] - Ngưỡng cho suggestive classes
 * @property {number} [weapon] - Ngưỡng cho vũ khí
 * @property {number} [drug] - Ngưỡng cho ma túy
 * @property {number} [alcohol] - Ngưỡng cho rượu
 * @property {number} [gore] - Ngưỡng cho nội dung máu me
 * @property {number} [violence] - Ngưỡng cho bạo lực
 * @property {number} [offensive] - Ngưỡng cho nội dung xúc phạm
 * @property {number} [selfHarm] - Ngưỡng cho tự làm hại
 * @property {number} [text] - Ngưỡng cho văn bản vi phạm
 * @property {number} [qr] - Ngưỡng cho QR code vi phạm
 * @property {number} [quality] - Ngưỡng cho chất lượng ảnh
 */

/**
 * Đánh giá nội dung ảnh dựa trên kết quả phân tích
 * @param {Object} analysis - Kết quả phân tích từ API SightEngine
 * @param {Thresholds} [thresholds] - Ngưỡng tùy chỉnh, mặc định là 0.5
 * @returns {EvaluationResult} - Kết quả đánh giá
 */
function evaluateImageContent(analysis, thresholds = {}) {
  // Ngưỡng mặc định cho các loại nội dung
  const defaults = {
    nudity: 0.5,
    nuditySuggestive: 0.3,
    weapon: 0.5,
    drug: 0.5,
    alcohol: 0.5,
    gore: 0.5,
    violence: 0.5,
    offensive: 0.5,
    selfHarm: 0.5,
    text: 0,
    qr: 0,
    quality: 0.8,
  };
  const t = { ...defaults, ...thresholds };
  const reasons = [];

  // Kiểm tra trạng thái request
  if (analysis.status !== 'success') {
    reasons.push('Analysis failed');
    return { approved: false, reasons };
  }

  // Kiểm tra nudity
  const nudity = analysis.nudity || {};
  const suggestive = nudity.suggestive_classes || {};
  if (
    nudity.sexual_activity > t.nudity ||
    nudity.sexual_display > t.nudity ||
    nudity.erotica > t.nudity ||
    nudity.very_suggestive > t.nudity ||
    nudity.suggestive > t.nudity ||
    nudity.mildly_suggestive > t.nudity ||
    suggestive.bikini > t.nuditySuggestive ||
    suggestive.cleavage > t.nuditySuggestive ||
    suggestive.lingerie > t.nuditySuggestive ||
    suggestive.male_underwear > t.nuditySuggestive ||
    suggestive.miniskirt > t.nuditySuggestive ||
    suggestive.minishort > t.nuditySuggestive ||
    suggestive.sextoy > t.nuditySuggestive ||
    suggestive.visibly_undressed > t.nuditySuggestive ||
    (suggestive.nudity_art > t.nuditySuggestive &&
      (nudity.context?.sea_lake_pool || 0) < 0.5)
  ) {
    reasons.push('Contains nudity or suggestive content');
  }
  // Kiểm tra weapon
  const weapon = analysis.weapon || {};
  const weaponClasses = weapon.classes || {};
  const firearmAction = weapon.firearm_action || {};
  if (
    weaponClasses.firearm > t.weapon ||
    weaponClasses.knife > t.weapon ||
    weaponClasses.firearm_gesture > t.weapon ||
    firearmAction.aiming_threat > t.weapon
  ) {
    reasons.push('Contains weapons');
  }

  // Kiểm tra recreational_drug
  const drug = analysis.recreational_drug || {};
  const drugClasses = drug.classes || {};
  if (
    drug.prob > t.drug ||
    drugClasses.cannabis > t.drug ||
    drugClasses.recreational_drugs_not_cannabis > t.drug
  ) {
    reasons.push('Contains recreational drugs');
  }

  // Kiểm tra alcohol
  if ((analysis.alcohol?.prob || 0) > t.alcohol) {
    reasons.push('Contains alcohol');
  }

  // Kiểm tra gore
  const gore = analysis.gore || {};
  const goreClasses = gore.classes || {};
  if (
    gore.prob > t.gore ||
    goreClasses.very_bloody > t.gore ||
    goreClasses.serious_injury > t.gore
  ) {
    reasons.push('Contains gore'); // Gộp tất cả thành một lý do
  }

  // Kiểm tra violence
  const violence = analysis.violence || {};
  const violenceClasses = violence.classes || {};
  if (
    violence.prob > t.violence ||
    violenceClasses.physical_violence > t.violence ||
    violenceClasses.firearm_threat > t.violence
  ) {
    reasons.push('Contains violence');
  }

  // Kiểm tra offensive
  const offensive = analysis.offensive || {};
  if (
    offensive.nazi > t.offensive ||
    offensive.supremacist > t.offensive ||
    offensive.terrorist > t.offensive ||
    offensive.middle_finger > t.offensive
  ) {
    reasons.push('Contains offensive content');
  }

  // Kiểm tra self-harm
  const selfHarm = analysis['self-harm'] || {};
  if (selfHarm.prob > t.selfHarm || selfHarm.type?.real > t.selfHarm) {
    reasons.push('Contains self-harm');
  }

  // Kiểm tra text
  const text = analysis.text || {};
  if (
    (text.profanity?.length || 0) > t.text ||
    (text.extremism?.length || 0) > t.text ||
    (text.drug?.length || 0) > t.text ||
    (text.weapon?.length || 0) > t.text ||
    (text.violence?.length || 0) > t.text ||
    (text['self-harm']?.length || 0) > t.text ||
    (text.spam?.length || 0) > t.text
  ) {
    reasons.push('Contains inappropriate text');
  }

  // Kiểm tra qr -
  const qr = analysis.qr || {};
  if (
    (qr.spam?.length || 0) > t.qr ||
    (qr.profanity?.length || 0) > t.qr ||
    (qr.blacklist?.length || 0) > t.qr ||
    qr.link.length > t.qr
  ) {
    reasons.push('Contains inappropriate QR codes');
  }

  // Kiểm tra tobacco, money, gambling
  if ((analysis.tobacco?.prob || 0) > t.drug) {
    reasons.push('Contains tobacco');
  }
  if ((analysis.money?.prob || 0) > t.drug) {
    reasons.push('Contains money-related content');
  }
  if ((analysis.gambling?.prob || 0) > t.drug) {
    reasons.push('Contains gambling content');
  }

  // Kiểm tra chất lượng ảnh
  if (
    (analysis.sharpness || 1) < t.quality ||
    analysis.brightness < 0.1 ||
    analysis.brightness > 0.9 ||
    (analysis.contrast || 1) < t.quality
  ) {
    reasons.push('Poor image quality');
  }

  // Kiểm tra loại nội dung
  if (
    (analysis.type?.ai_generated || 0) > 0.8 ||
    (analysis.type?.deepfake || 0) > 0.8
  ) {
    reasons.push('Likely AI-generated content');
  }

  // Trả về kết quả
  return {
    approved: reasons.length === 0,
    reasons,
  };
}

module.exports = evaluateImageContent;
