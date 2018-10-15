<?php
if (!defined('__TYPECHO_ROOT_DIR__')) exit;
/**
 * 替换原来的鼠标指向提醒方式
 *
 * @package StyledTip
 * @author BK
 * @link http://www.bkspace.co
 * @version 1.0.0
 */
class StyledTip_Plugin implements Typecho_Plugin_Interface
{
    /**
     * 激活插件方法,如果激活失败,直接抛出异常
     *
     * @access public
     * @return void
     * @throws Typecho_Plugin_Exception
     */
    public static function activate()
    {
        Typecho_Plugin::factory('Widget_Archive')->header = array('StyledTip_Plugin', 'header');
    }

    /**
     * 禁用插件方法,如果禁用失败,直接抛出异常
     *
     * @static
     * @access public
     * @return void
     * @throws Typecho_Plugin_Exception
     */
    public static function deactivate()
    {
    }

    /**
     * 获取插件配置面板
     *
     * @access public
     * @param Typecho_Widget_Helper_Form $form 配置面板
     * @return void
     */
    public static function config(Typecho_Widget_Helper_Form $form)
    {
        /** 分类名称 */
        $bgcolor = new Typecho_Widget_Helper_Form_Element_Text('bgcolor', NULL, '85,85,85', _t('提示框背景颜色'), _t("输入RGB颜色值(数字之间使用英文逗号隔开)，默认是85,85,85(深灰色)"));
        $form->addInput($bgcolor);
        $padding = new Typecho_Widget_Helper_Form_Element_Text('padding', NULL, '15', _t("提示框内边距"), _t("提示框边到文字的距离，建议为10-25"));
        $form->addInput($padding);
    }

    /**
     * 个人用户的配置面板
     *
     * @access public
     * @param Typecho_Widget_Helper_Form $form
     * @return void
     */
    public static function personalConfig(Typecho_Widget_Helper_Form $form)
    {
    }


    /**
     * 输出顶部
     *
     * @access public
     * @return void
     */
    public static function header()
    {

        $options = Typecho_Widget::widget('Widget_Options')->plugin('StyledTip');
        $elem = '.tip';
        echo '<link href="/usr/plugins/StyledTip/style.css" rel="stylesheet"/>';
        echo '<script type="text/javascript" color="' . $options->bgcolor . '" padding="' . $options->padding . '" src="/usr/plugins/StyledTip/function.js"></script>';
    }

}
