/**
 * @license
 * Blockly Tests
 *
 * Copyright 2014 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

var XML_TEXT = ['<xml xmlns="http://www.w3.org/1999/xhtml">',
  '  <block type="controls_repeat_ext" inline="true" x="21" y="23">',
  '    <value name="TIMES">',
  '      <block type="math_number">',
  '        <field name="NUM">10</field>',
  '      </block>',
  '    </value>',
  '    <statement name="DO">',
  '      <block type="variables_set" inline="true">',
  '        <field name="VAR">item</field>',
  '        <value name="VALUE">',
  '          <block type="lists_create_empty"></block>',
  '        </value>',
  '        <next>',
  '          <block type="text_print" inline="false">',
  '            <value name="TEXT">',
  '              <block type="text">',
  '                <field name="TEXT">Hello</field>',
  '              </block>',
  '            </value>',
  '          </block>',
  '        </next>',
  '      </block>',
  '    </statement>',
  '  </block>',
  '</xml>'].join('\n');

function test_textToDom() {
  var dom = Blockly.Xml.textToDom(XML_TEXT);
  assertEquals('XML tag', 'xml', dom.nodeName);
  assertEquals('Block tags', 6, dom.getElementsByTagName('block').length);
}

function test_domToText() {
  var dom = Blockly.Xml.textToDom(XML_TEXT);
  var text = Blockly.Xml.domToText(dom);
  assertEquals('Round trip', XML_TEXT.replace(/\s+/g, ''),
      text.replace(/\s+/g, ''));
}

function test_domToWorkspace() {
  Blockly.Blocks.test_block = {
    init: function() {
      this.jsonInit({
        message0: 'test',
      });
    }
  };

  var workspace = new Blockly.Workspace();
  try {
    var dom = Blockly.Xml.textToDom(
        '<xml xmlns="http://www.w3.org/1999/xhtml">' +
        '  <block type="test_block" inline="true" x="21" y="23">' +
        '  </block>' +
        '</xml>');
    Blockly.Xml.domToWorkspace(dom, workspace);
    assertEquals('Block count', 1, workspace.getAllBlocks().length);
  } finally {
    delete Blockly.Blocks.test_block;

    workspace.dispose();
  }
}

function test_domToPrettyText() {
  var dom = Blockly.Xml.textToDom(XML_TEXT);
  var text = Blockly.Xml.domToPrettyText(dom);
  assertEquals('Round trip', XML_TEXT.replace(/\s+/g, ''),
      text.replace(/\s+/g, ''));
}

/**
 * Tests the that appendDomToWorkspace works in a headless mode.
 * Also see test_appendDomToWorkspace() in workspace_svg_test.js.
 */
unction test_appendDomToWorkspace() {
  Blockly.Blocks.test_block = {
    init: function() {
      this.jsonInit({
        message0: 'test',
      });
    }
  };

  try {
    var dom = Blockly.Xml.textToDom(
        '<xml xmlns="http://www.w3.org/1999/xhtml">' +
        '  <block type="test_block" inline="true" x="21" y="23">' +
        '  </block>' +
        '</xml>');
    var workspace = new Blockly.Workspace();
    Blockly.Xml.appendDomToWorkspace(dom, workspace);
    assertEquals('Block count', 1, workspace.getAllBlocks().length);
    var newBlockIds = Blockly.Xml.appendDomToWorkspace(dom, workspace);
    assertEquals('Block count', 2, workspace.getAllBlocks().length);
    assertEquals('Number of new block ids',1,newBlockIds.length);
  } finally {
    delete Blockly.Blocks.test_block;
    workspace.dispose();
  }
}