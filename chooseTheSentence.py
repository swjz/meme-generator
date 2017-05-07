# -*- coding: UTF-8 -*-
# encoding = utf-8

import MySQLdb as mdb
import random


class ChooseTheSentence:
    con = None
    rows = []

    def __init__(self):
        print 'the model has been created'

    def __connect_database(self):
        # 全局连接
        con = mdb.connect("192.168.100.2", "root", "mynewpassword", "sentences", charset="utf8")
        return con

    def __getTheSentence(self):
        l = len(self.rows)
        # tmp = random.randint(0, l - 1)
        if l == 0:
            return None
        else:
            return self.rows[0][0]

    def __getTheTopFiveSentences(self, expression):
        con = self.__connect_database()
        cur = con.cursor()
        try:
            cur.execute(expression)
            con.commit()
            self.rows = cur.fetchall()
            print self.rows
        except mdb.Error, e:
            print e
            return False
        finally:
            if con:
                cur.close()
                con.close()
        return True

    def __chooseTheSentence(self, emotion, **args):
        # 表情/性别/年龄这些信息是根本的不可丢弃的
        # args参数需要做一个删选
        # 我们认为参数值大于50这样数据有效
        tmp = {}
        expr = ''
        for arg in args:
            if args[arg] > 50:
                tmp[arg] = args[arg]
        # 查询语句构造
        for i in tmp:
            expr = expr + '+' + i;
        expr = expr[1:]
        expression = "SELECT sentence, " + expr + " as sum FROM sentences WHERE emotion='" + emotion + "' ORDER BY sum DESC LIMIT 5"
        print expression
        if self.__getTheTopFiveSentences(expression):
            return True
        else:
            return False

    def chooseTheSentence(self, emotion, **args):
        self.__chooseTheSentence(emotion, **args)

    def getTheSentence(self):
        return self.__getTheSentence()

    def addSentence(self, emotion, sentence, gender, age, attractive, eye_open, mouth_open, sunglass, smile):
        con = self.__connect_database()
        cur = con.cursor()
        expression = "INSERT INTO sentences(emotion, sentence, gender, age, attractive, eye_open, mouth_open, sunglass, smile) VALUES('" \
                     + emotion + "','" \
                     + sentence + "'," \
                     + gender + "," \
                     + age + "," \
                     + attractive + "," \
                     + eye_open + "," \
                     + mouth_open + "," \
                     + sunglass + "," \
                     + smile + ")"
        try:
            cur.execute(expression)
            con.commit()
        except mdb.Error, e:
            print e
            return False
        finally:
            if con:
                cur.close()
                con.close()
        return True
