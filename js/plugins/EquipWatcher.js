//=============================================================================
// EquipWatcher.js
//=============================================================================

/*:ja
 * @plugindesc 装備している装備を監視し、特定の防具の着脱によりスイッチをONOFFします。
 * @author つうろ
 *
 * @help このプラグインにはプラグインコマンドはありません。
 *
 *  武器の「メモ」欄に、<skill_id:3> と書いた場合、
 * 通常攻撃の際、3番のスキルが発動します。
 * ※特に記述がなければ、通常通り1番のスキルが採用されます。
 *
 * チェックポイント:
 * - 二刀流の場合、利き腕(先に定義された方)に持っているスキルIDが採用されます。
 * - スキルタイプは「なし」にするのが望ましいです。
 * さもなくば、技などを封じられたとき、攻撃が出来なくなります。
 *
 * 想定される用途:
 * - 全体攻撃可能な武器
 * - 2回攻撃、3回攻撃する武器
 * - 回復魔法をスキルに指定した場合、
 * 「攻撃」を選んだ際、味方の選択が出来、その仲間を回復します
 * - 防御コマンドなどと同等になる武器も実現可能です。
 */

(function() {

  //
  // set skill id for attack.
  //
  Game_Actor.prototype.attackSkillId = function() {
    var normalId = Game_BattlerBase.prototype.attackSkillId.call(this);
    if(this.hasNoWeapons()){
      return normalId;
    }
    var weapon = this.weapons()[0];  // at plural weapon, one's first skill.
    var id = weapon.meta.skill_id;
    return id ? Number(id) : normalId;
  };

  //
  // for command at battle
  //
  var _Scene_Battle_commandAttack = Scene_Battle.prototype.commandAttack;
  Scene_Battle.prototype.commandAttack = function() {
    BattleManager.inputtingAction().setAttack();
    // normal attack weapon (or other single attack weapon)
    var action = BattleManager.inputtingAction();
    if(action.needsSelection() && action.isForOpponent()){
      _Scene_Battle_commandAttack.call(this);
      return;
    }
    // special skill weapon
    this.onSelectAction();
  };

})();
